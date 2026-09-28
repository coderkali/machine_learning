"""Download immutable daily OpenAQ archive files for selected stations."""

from __future__ import annotations

import argparse
import time
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path

import pandas as pd
import requests


ARCHIVE_BASE_URL = "https://openaq-data-archive.s3.amazonaws.com/records/csv.gz"


@dataclass
class CollectionSummary:
    stations: int = 0
    files_downloaded: int = 0
    files_skipped: int = 0
    days_missing: int = 0
    bytes_stored: int = 0


def archive_url(location_id: int, day: date) -> str:
    """Build the public S3 URL for one station-day archive object."""
    filename = f"location-{location_id}-{day:%Y%m%d}.csv.gz"
    return (
        f"{ARCHIVE_BASE_URL}/locationid={location_id}/"
        f"year={day:%Y}/month={day:%m}/{filename}"
    )


def load_station_ids(stations_path: Path, selected_station: int | None = None) -> list[int]:
    """Load location IDs from the discovered station inventory."""
    stations = pd.read_csv(stations_path, usecols=["location_id"])
    station_ids = sorted(stations["location_id"].dropna().astype(int).unique())

    if selected_station is not None:
        if selected_station not in station_ids:
            raise ValueError(f"Location {selected_station} is not present in {stations_path}")
        station_ids = [selected_station]

    return station_ids


def collect_station_history(
    location_id: int,
    start_date: date,
    end_date: date,
    output_root: Path,
    session: requests.Session | None = None,
    pause_seconds: float = 0.05,
) -> CollectionSummary:
    """Download one station's archive files without editing their contents."""
    if end_date < start_date:
        raise ValueError("end_date must be on or after start_date")

    client = session or requests.Session()
    summary = CollectionSummary(stations=1)
    current_day = start_date

    while current_day <= end_date:
        relative_directory = Path(
            f"locationid={location_id}",
            f"year={current_day:%Y}",
            f"month={current_day:%m}",
        )
        filename = f"location-{location_id}-{current_day:%Y%m%d}.csv.gz"
        destination = output_root / relative_directory / filename

        if destination.exists():
            summary.files_skipped += 1
            summary.bytes_stored += destination.stat().st_size
            current_day += timedelta(days=1)
            continue

        response = client.get(archive_url(location_id, current_day), timeout=30)
        if response.status_code == 404:
            summary.days_missing += 1
        else:
            response.raise_for_status()
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(response.content)
            summary.files_downloaded += 1
            summary.bytes_stored += len(response.content)

        current_day += timedelta(days=1)
        if pause_seconds:
            time.sleep(pause_seconds)

    return summary


def collect(
    station_ids: list[int],
    start_date: date,
    end_date: date,
    output_root: Path,
) -> CollectionSummary:
    """Collect archive files for all selected stations."""
    total = CollectionSummary(stations=len(station_ids))
    for location_id in station_ids:
        result = collect_station_history(location_id, start_date, end_date, output_root)
        total.files_downloaded += result.files_downloaded
        total.files_skipped += result.files_skipped
        total.days_missing += result.days_missing
        total.bytes_stored += result.bytes_stored
    return total


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Download immutable daily OpenAQ S3 archive files."
    )
    parser.add_argument("--start-date", type=date.fromisoformat, required=True)
    parser.add_argument("--end-date", type=date.fromisoformat, required=True)
    parser.add_argument("--station", type=int, help="Only collect one location ID")
    parser.add_argument(
        "--stations-file",
        type=Path,
        default=Path("data/raw/stations.csv"),
    )
    parser.add_argument(
        "--output-root",
        type=Path,
        default=Path("data/raw/openaq"),
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    started_at = time.perf_counter()
    station_ids = load_station_ids(args.stations_file, args.station)
    summary = collect(station_ids, args.start_date, args.end_date, args.output_root)
    elapsed_seconds = time.perf_counter() - started_at

    print(f"Stations: {summary.stations}")
    print(f"Date range: {args.start_date} to {args.end_date}")
    print(f"Files downloaded: {summary.files_downloaded}")
    print(f"Files skipped: {summary.files_skipped}")
    print(f"Days missing: {summary.days_missing}")
    print(f"Total size: {summary.bytes_stored:,} bytes")
    print(f"Elapsed: {elapsed_seconds:.2f} seconds")


if __name__ == "__main__":
    main()