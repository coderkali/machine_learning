"""Build the cleaned daily PM2.5 table from raw OpenAQ files (DAF-10).

This module is the single home of the raw -> daily table logic. The
notebooks, the model training and the live service in Phase 8 all import
from here, so the features are always computed the same way.

Functions:
    load_raw(location_id, raw_root)   -> 15-minute PM2.5 frame
    to_hourly(frame)                  -> hourly series
    apply_cleaning(hourly)            -> the DAF-09 decisions, in order
    to_daily(hourly, hourly_raw, min_hours=18)  -> daily table: hours, mean, until_17
    add_target(daily)                 -> next calendar day's mean
    build_daily_table(location_id, raw_root)    -> the five functions above, run in order

Run from the command line:
    python -m delhi_air.clean --station 17
writes data/processed/daily_17.parquet
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd

# DAF-09 decisions, chosen by hand — never learned from the data, so
# cleaning cannot leak anything from the test period.
FILL_LIMIT_HOURS = 2                                 # holes up to this long get a straight-line guess
BROKEN_SENSOR_DAYS = ("2025-07-04", "2025-07-11")    # Fault 7: sensor error week, both days included


def load_raw(location_id: int, raw_root: Path) -> pd.DataFrame:
    """Read every raw file of one station and keep the PM2.5 readings.

    Returns one row per 15-minute reading, oldest first, with two columns:
    datetime (IST, +05:30, straight from the file) and value (µg/m³).
    Raw files are only read, never changed.
    """
    station_dir = Path(raw_root) / f"locationid={location_id}"
    files = sorted(station_dir.rglob("*.csv.gz"))
    if not files:
        # Fail loudly: an empty table here would silently give an empty forecast later
        raise FileNotFoundError(f"no raw files under {station_dir}")

    raw_all = pd.concat([pd.read_csv(f, compression="gzip") for f in files], ignore_index=True)
    pm25 = raw_all[raw_all["parameter"] == "pm25"].copy()

    # The text already carries "+05:30", so to_datetime keeps the IST offset
    pm25["datetime"] = pd.to_datetime(pm25["datetime"])

    return pm25[["datetime", "value"]].sort_values("datetime").reset_index(drop=True)


def to_hourly(pm25: pd.DataFrame) -> pd.Series:
    """15-minute PM2.5 readings -> one average per hour.

    Every hour in the span gets a slot, even one with no reading at all
    (its value is NaN). Cleaning later decides what, if anything, to do
    about an empty hour; this function only takes the average of what is
    there.
    """
    readings = pm25.set_index("datetime")["value"].sort_index()
    return readings.resample("1h").mean()


def fill_short_holes(hourly: pd.Series, max_hours: int) -> pd.Series:
    """Fill holes of max_hours or shorter with a straight line. Longer holes stay empty."""
    is_empty = hourly.isna()
    run_id = (is_empty != is_empty.shift()).cumsum()               # a new id each time empty/full switches
    hole_length = is_empty.groupby(run_id).transform("sum")         # every empty hour knows its hole's length
    short_hole = is_empty & (hole_length <= max_hours)

    straight_line = hourly.interpolate(method="time", limit_area="inside")
    return hourly.where(~short_hole, straight_line)                 # use the guess only inside short holes


def remove_days(hourly: pd.Series, first_day: str, last_day: str) -> pd.Series:
    """Blank every hour from first_day to last_day (both included)."""
    start = pd.Timestamp(first_day, tz=hourly.index.tz)
    end = pd.Timestamp(last_day, tz=hourly.index.tz) + pd.Timedelta(days=1)
    return hourly.mask((hourly.index >= start) & (hourly.index < end))


def apply_cleaning(
    hourly: pd.Series,
    fill_limit_hours: int = FILL_LIMIT_HOURS,
    broken_days: tuple[str, str] = BROKEN_SENSOR_DAYS,
) -> pd.Series:
    """Hourly PM2.5 -> cleaned hourly, the DAF-09 decisions in one fixed order.

    Does not change ``hourly``. Faults 1, 3, 4, 5 and 6 are "leave it" —
    nothing to apply, so they are not code, only a decision already
    recorded in docs/data_faults.md.
    """
    # Fault 7 (broken sensor week): remove it BEFORE filling, so no guess is made from a bad reading
    cleaned = remove_days(hourly, *broken_days)

    # Fault 2 (missing hours): fill holes of 1-2 hours only
    cleaned = fill_short_holes(cleaned, fill_limit_hours)

    return cleaned


def hours_known_at_18(hourly_raw: pd.Series, hourly_clean: pd.Series) -> pd.Series:
    """hourly_clean, minus a filled hour that needed a reading from 18:00 or later.

    A hole that touches 17:00 can only be filled once the hour after it has
    a reading. At 18:00, the hour after 17:00 hasn't finished yet, so that
    fill uses a number the live service could never have at forecast time.
    Every other fill is safe: its neighbours are already in the past.
    """
    is_empty = hourly_raw.isna()
    run_id = (is_empty != is_empty.shift()).cumsum()
    hole_end = pd.Series(hourly_raw.index, index=hourly_raw.index).groupby(run_id).transform("max")
    right_neighbour_hour = (hole_end + pd.Timedelta(hours=1)).dt.hour

    was_filled = is_empty & hourly_clean.notna()
    needs_evening = was_filled & (hourly_raw.index.hour <= 17) & (right_neighbour_hour >= 18)
    return hourly_clean.mask(needs_evening)


def to_daily(hourly_clean: pd.Series, hourly_raw: pd.Series, min_hours: int = 18) -> pd.DataFrame:
    """Cleaned hourly PM2.5 -> one row per calendar day (IST), gap-free.

    hourly_raw is the same series before apply_cleaning() ran; it is only
    used to keep future-leaking fills out of pm25_until_17 (see
    hours_known_at_18). Columns:
        pm25_mean       average of the day's hours
        hours           how many hours have a number
        pm25_until_17   average of hours 00:00-17:00 (what Asha knows at 18:00)
        valid           hours >= min_hours
    """
    until_17_source = hours_known_at_18(hourly_raw, hourly_clean)
    until_17 = until_17_source[until_17_source.index.hour <= 17]

    daily = pd.DataFrame({
        "pm25_mean": hourly_clean.resample("D").mean(),
        "hours": hourly_clean.resample("D").count(),
        "pm25_until_17": until_17.resample("D").mean(),
    })
    daily["valid"] = daily["hours"] >= min_hours

    # gap-free calendar, so "the next row" really is "the next day"
    full_range = pd.date_range(daily.index.min(), daily.index.max(), freq="D", tz=daily.index.tz)
    daily = daily.reindex(full_range)
    daily["valid"] = daily["valid"].fillna(False).astype(bool)
    return daily


def add_target(daily: pd.DataFrame) -> pd.DataFrame:
    """Add target = tomorrow's pm25_mean, written on today's row.

    Empty whenever tomorrow is missing or invalid (fewer than min_hours),
    so the model is never trained to predict a target built from too few
    readings.
    """
    daily = daily.copy()
    next_day_valid = daily["valid"].shift(-1, fill_value=False)
    daily["target"] = daily["pm25_mean"].shift(-1).where(next_day_valid)
    return daily


def build_daily_table(location_id: int, raw_root: Path) -> pd.DataFrame:
    """Raw OpenAQ files -> the cleaned daily table. The whole DAF-10 pipeline, one call."""
    pm25_raw = load_raw(location_id, raw_root)
    hourly = to_hourly(pm25_raw)
    hourly_clean = apply_cleaning(hourly)
    daily = to_daily(hourly_clean, hourly_raw=hourly)
    return add_target(daily)


def main(argv: list[str] | None = None) -> None:
    """CLI entry point: python -m delhi_air.clean --station 17."""
    import argparse

    project_root = Path(__file__).resolve().parents[2]

    parser = argparse.ArgumentParser(description="Build the cleaned daily PM2.5 table for one station.")
    parser.add_argument("--station", type=int, required=True, help="OpenAQ location id, e.g. 17")
    parser.add_argument("--raw-root", type=Path, default=project_root / "data/raw/openaq",
                         help="folder holding locationid=<id>/ (default: data/raw/openaq)")
    parser.add_argument("--out-dir", type=Path, default=project_root / "data/processed",
                         help="folder to write the parquet file into (default: data/processed)")
    args = parser.parse_args(argv)

    daily = build_daily_table(args.station, args.raw_root)

    args.out_dir.mkdir(parents=True, exist_ok=True)
    out_path = args.out_dir / f"daily_{args.station}.parquet"
    daily.to_parquet(out_path)
    print(f"Wrote {len(daily)} rows to {out_path}")


if __name__ == "__main__":
    main()
