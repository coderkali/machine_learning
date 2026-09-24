"""Unit tests for delhi_air.clean (DAF-10).

Each test builds a tiny frame by hand and checks one rule with one number:
    - 17 hours in a day is invalid, 18 is valid
    - target of day D is the mean of D + 1, empty when D + 1 is missing
    - the day boundary is IST midnight, not UTC midnight
    - pm25_until_17 ignores hours 18 to 23
    - each DAF-09 cleaning decision does what it says
"""

import pandas as pd
import pytest

from delhi_air.clean import (
    add_target,
    apply_cleaning,
    fill_short_holes,
    hours_known_at_18,
    load_raw,
    main,
    remove_days,
    to_daily,
    to_hourly,
)


# ---------- helpers ----------

def write_raw_file(folder, name, rows):
    """Write a tiny raw file in the same shape as an OpenAQ archive file."""
    folder.mkdir(parents=True, exist_ok=True)
    frame = pd.DataFrame(rows, columns=["location_id", "datetime", "parameter", "value"])
    frame.to_csv(folder / name, index=False, compression="gzip")


# ---------- load_raw ----------

def test_load_raw_keeps_only_pm25_sorted_and_in_ist(tmp_path):
    station = tmp_path / "locationid=17" / "year=2025" / "month=02"
    # Two files; the second one is written newest-first on purpose
    write_raw_file(station, "location-17-20250219.csv.gz", [
        (17, "2025-02-19T23:45:00+05:30", "pm25", 80.0),
        (17, "2025-02-19T23:45:00+05:30", "no2", 40.0),
    ])
    write_raw_file(station, "location-17-20250220.csv.gz", [
        (17, "2025-02-20T00:15:00+05:30", "pm25", 95.0),
        (17, "2025-02-20T00:00:00+05:30", "pm25", 90.0),
        (17, "2025-02-20T00:00:00+05:30", "pm10", 300.0),
    ])

    pm25 = load_raw(17, tmp_path)

    assert list(pm25.columns) == ["datetime", "value"]
    assert pm25["value"].tolist() == [80.0, 90.0, 95.0]                   # no2 and pm10 dropped, oldest first
    assert str(pm25["datetime"].dt.tz) == "UTC+05:30"                     # the IST offset survived
    assert pm25["datetime"].iloc[0] == pd.Timestamp("2025-02-19 23:45", tz="Asia/Kolkata")


def test_load_raw_fails_loudly_when_station_has_no_files(tmp_path):
    with pytest.raises(FileNotFoundError):
        load_raw(999, tmp_path)


# ---------- to_hourly ----------

def _readings(pairs):
    """Build the two-column frame load_raw() would hand to to_hourly()."""
    frame = pd.DataFrame(pairs, columns=["datetime", "value"])
    frame["datetime"] = pd.to_datetime(frame["datetime"])
    return frame


def test_to_hourly_averages_readings_inside_the_same_hour():
    pm25 = _readings([
        ("2025-03-25T14:00:00+05:30", 80.0),
        ("2025-03-25T14:15:00+05:30", 90.0),
        ("2025-03-25T14:45:00+05:30", 100.0),
    ])

    hourly = to_hourly(pm25)

    assert hourly.loc[pd.Timestamp("2025-03-25 14:00", tz="Asia/Kolkata")] == 90.0


def test_to_hourly_leaves_a_gap_as_nan_instead_of_skipping_it():
    # 14:00 and 16:00 have a reading; 15:00 has none, but still needs a slot
    pm25 = _readings([
        ("2025-03-25T14:00:00+05:30", 80.0),
        ("2025-03-25T16:00:00+05:30", 100.0),
    ])

    hourly = to_hourly(pm25)

    assert len(hourly) == 3
    assert hourly.isna().sum() == 1
    assert hourly.loc[pd.Timestamp("2025-03-25 15:00", tz="Asia/Kolkata")] != hourly.loc[pd.Timestamp("2025-03-25 15:00", tz="Asia/Kolkata")]  # NaN


def test_to_hourly_does_not_require_sorted_input():
    # Newest first, on purpose — to_hourly must sort before it resamples
    pm25 = _readings([
        ("2025-03-25T14:45:00+05:30", 100.0),
        ("2025-03-25T14:00:00+05:30", 80.0),
    ])

    hourly = to_hourly(pm25)

    assert hourly.iloc[0] == 90.0


# ---------- apply_cleaning ----------

def _hourly(start, values):
    """An hourly series (some entries NaN), like to_hourly() would return."""
    index = pd.date_range(start, periods=len(values), freq="1h", tz="Asia/Kolkata")
    return pd.Series(values, index=index, dtype=float)


def test_fill_short_holes_fills_up_to_the_limit_and_no_further():
    # 1-hour hole (index 1) and a 3-hour hole (index 4-6); limit is 2
    hourly = _hourly("2025-03-25 00:00", [10.0, None, 20.0, 30.0, None, None, None, 70.0])

    filled = fill_short_holes(hourly, max_hours=2)

    assert filled.iloc[1] == 15.0                 # short hole: straight line between 10 and 20
    assert filled.iloc[4:7].isna().all()           # 3-hour hole is longer than the limit: left alone


def test_remove_days_blanks_only_the_named_range():
    hourly = _hourly("2025-07-03 23:00", [1.0] * 4)   # 03 23:00, 04 00:00, 04 01:00, 05 00:00-ish

    cleaned = remove_days(hourly, "2025-07-04", "2025-07-04")

    assert cleaned.iloc[0] == 1.0                       # 3 Jul 23:00: before the range, untouched
    assert cleaned.iloc[1:].isna().all()                # everything from 4 Jul 00:00 onward is inside it


def test_apply_cleaning_removes_the_broken_week_before_filling_holes():
    # A short (1-hour) hole that sits inside the broken week must stay empty:
    # Fault 7 runs first, so there is no good neighbour left to interpolate from.
    hourly = _hourly("2025-07-10 22:00", [50.0, None, 60.0])  # 22:00, 23:00, 00:00 (5 Jul is still "broken")

    cleaned = apply_cleaning(hourly, fill_limit_hours=2, broken_days=("2025-07-04", "2025-07-11"))

    assert cleaned.isna().all(), "a hole inside the broken week was filled instead of left empty"


def test_apply_cleaning_still_fills_short_holes_outside_the_broken_week():
    hourly = _hourly("2025-08-01 10:00", [10.0, None, 20.0])   # 1-hour hole, nowhere near the broken week

    cleaned = apply_cleaning(hourly, fill_limit_hours=2, broken_days=("2025-07-04", "2025-07-11"))

    assert cleaned.iloc[1] == 15.0


def test_apply_cleaning_does_not_change_its_input():
    hourly = _hourly("2025-08-01 10:00", [10.0, None, 20.0])
    before = hourly.copy()

    apply_cleaning(hourly)

    pd.testing.assert_series_equal(hourly, before)


# ---------- to_daily ----------

def _full_day(date, values, tz="Asia/Kolkata"):
    """24 hourly values (00:00-23:00) for one IST calendar day."""
    index = pd.date_range(f"{date} 00:00", periods=24, freq="1h", tz=tz)
    return pd.Series(values, index=index, dtype=float)


def test_to_daily_17_hours_is_invalid_18_is_valid():
    # Day 1: 17 real hours (7 empty). Day 2: 18 real hours (6 empty).
    day1 = [10.0] * 17 + [None] * 7
    day2 = [10.0] * 18 + [None] * 6
    hourly = pd.concat([_full_day("2025-03-25", day1), _full_day("2025-03-26", day2)])

    daily = to_daily(hourly, hourly_raw=hourly)

    assert not daily.loc["2025-03-25", "valid"]
    assert daily.loc["2025-03-26", "valid"]


def test_to_daily_day_boundary_is_ist_midnight_not_utc():
    # 25 Mar 23:00 IST and 26 Mar 00:00 IST are only 1 hour apart, but
    # 26 Mar 00:00 IST is still 25 Mar in UTC (18:30). A day boundary
    # computed from UTC would wrongly put both hours on 25 March.
    index = pd.to_datetime(["2025-03-25 23:00", "2025-03-26 00:00"]).tz_localize("Asia/Kolkata")
    hourly = pd.Series([10.0, 20.0], index=index)

    daily = to_daily(hourly, hourly_raw=hourly)

    assert daily.loc["2025-03-25", "hours"] == 1
    assert daily.loc["2025-03-26", "hours"] == 1


def test_to_daily_pm25_until_17_ignores_hours_18_to_23():
    values = [10.0] * 18 + [1000.0] * 6   # hours 0-17 = 10, hours 18-23 = 1000
    hourly = _full_day("2025-03-25", values)

    daily = to_daily(hourly, hourly_raw=hourly)

    assert daily.loc["2025-03-25", "pm25_until_17"] == 10.0
    assert daily.loc["2025-03-25", "pm25_mean"] > 100    # the evening hours still count in the full day


def test_hours_known_at_18_masks_a_fill_that_needs_an_evening_reading():
    # A hole at 17:00, with real readings at 16:00 and 18:00. fill_short_holes()
    # can straight-line it, but that guess needs the 18:00 reading, which the
    # live service does not have at forecast time.
    raw = _hourly("2025-03-25 16:00", [40.0, None, 60.0])   # 16:00, 17:00, 18:00
    clean = fill_short_holes(raw, max_hours=2)
    assert clean.iloc[1] == 50.0   # sanity: the hole really was filled

    known = hours_known_at_18(raw, clean)

    assert pd.isna(known.iloc[1]), "a fill that needed the 18:00 reading was kept"


def test_hours_known_at_18_keeps_a_fill_whose_neighbours_are_earlier_in_the_day():
    # Same shape of hole, but earlier in the day: both neighbours are already past by 18:00.
    raw = _hourly("2025-03-25 09:00", [40.0, None, 60.0])   # 09:00, 10:00, 11:00
    clean = fill_short_holes(raw, max_hours=2)

    known = hours_known_at_18(raw, clean)

    assert known.iloc[1] == clean.iloc[1]


# ---------- add_target ----------

def _daily(dates, pm25_mean, hours):
    index = pd.DatetimeIndex(pd.to_datetime(dates)).tz_localize("Asia/Kolkata")
    daily = pd.DataFrame({"pm25_mean": pm25_mean, "hours": hours}, index=index)
    daily["valid"] = daily["hours"] >= 18
    return daily


def test_add_target_is_tomorrows_mean_written_on_todays_row():
    daily = _daily(
        ["2025-03-25", "2025-03-26", "2025-03-27"],
        pm25_mean=[50.0, 60.0, 70.0],
        hours=[20, 20, 20],
    )

    result = add_target(daily)

    # This is the DAF-05 shift(-1) rule: 25 Mar's target is 26 Mar's mean, not its own.
    assert result.loc["2025-03-25", "target"] == 60.0
    assert result.loc["2025-03-26", "target"] == 70.0


def test_add_target_is_empty_when_tomorrow_is_missing_or_invalid():
    # A gap-free calendar, the shape to_daily() always hands to add_target():
    # 26 Mar is invalid (too few hours), 27 Mar has no reading at all.
    daily = _daily(
        ["2025-03-25", "2025-03-26", "2025-03-27", "2025-03-28"],
        pm25_mean=[50.0, 60.0, float("nan"), 70.0],
        hours=[20, 10, 0, 20],
    )

    result = add_target(daily)

    assert pd.isna(result.loc["2025-03-25", "target"]), "tomorrow (26 Mar) is invalid"
    assert pd.isna(result.loc["2025-03-26", "target"]), "tomorrow (27 Mar) has no reading"
    assert result.loc["2025-03-27", "target"] == 70.0


# ---------- CLI ----------

def test_main_writes_a_parquet_file_with_the_daily_columns(tmp_path):
    raw_root = tmp_path / "raw"
    out_dir = tmp_path / "processed"
    station = raw_root / "locationid=1" / "year=2025" / "month=03"
    # Two days' worth of hourly-spaced readings — enough for to_daily() to build real rows
    rows = [
        (1, f"2025-03-2{5 + day}T{hour:02d}:00:00+05:30", "pm25", 50.0 + hour)
        for day in range(2)
        for hour in range(24)
    ]
    write_raw_file(station, "location-1-20250325.csv.gz", rows)

    main(["--station", "1", "--raw-root", str(raw_root), "--out-dir", str(out_dir)])

    out_path = out_dir / "daily_1.parquet"
    assert out_path.exists()

    daily = pd.read_parquet(out_path)
    assert list(daily.columns) == ["pm25_mean", "hours", "pm25_until_17", "valid", "target"]
    assert len(daily) == 2


def test_main_fails_loudly_when_the_station_has_no_raw_files(tmp_path):
    with pytest.raises(FileNotFoundError):
        main(["--station", "999", "--raw-root", str(tmp_path / "raw"), "--out-dir", str(tmp_path / "processed")])
