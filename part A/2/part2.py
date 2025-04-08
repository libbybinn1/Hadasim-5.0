import csv
import os
import math
from datetime import datetime
from collections import defaultdict

# Convert and validate single record
def clean_and_validate(record):
    try:
        time = datetime.strptime(record['timestamp'].strip(), "%d/%m/%Y %H:%M")
        val = float(record['value'].strip())
        if math.isnan(val):
            return None
        return time, val
    except:
        return None

# Read rows and extract valid entries
def load_clean_data(file_name):
    with open(file_name, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for line in reader:
            valid = clean_and_validate(line)
            if valid:
                yield valid

# Organize values by rounded hour
def categorize_by_hour(data):
    buckets = defaultdict(list)
    for dt, val in data:
        hour_time = dt.replace(minute=0, second=0, microsecond=0)
        buckets[hour_time].append(val)
    return buckets

# Save results to file
def export_summary(path, hourly_data):
    with open(path, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['hour_start', 'avg_value'])
        for hour in sorted(hourly_data):
            avg = sum(hourly_data[hour]) / len(hourly_data[hour])
            writer.writerow([hour.strftime("%Y-%m-%d %H:%M:%S"), round(avg, 2)])

# Main logic per daily chunks
def segment_and_process_by_date(source_file, output_path):
    calendar_data = defaultdict(list)

    for dt, val in load_clean_data(source_file):
        calendar_data[dt.date()].append((dt, val))

    temp_outputs = []

    for single_day, records in calendar_data.items():
        grouped = categorize_by_hour(records)
        temp_file = f"hourly_{single_day.strftime('%Y%m%d')}.csv"
        export_summary(temp_file, grouped)
        temp_outputs.append(temp_file)

    with open(output_path, 'w', encoding='utf-8', newline='') as out_csv:
        writer = csv.writer(out_csv)
        writer.writerow(['hour_start', 'avg_value'])
        for temp in sorted(temp_outputs):
            with open(temp, 'r', encoding='utf-8') as in_csv:
                reader = csv.reader(in_csv)
                next(reader)  # Skip headers
                for line in reader:
                    writer.writerow(line)

    for temp in temp_outputs:
        os.remove(temp)

# Optional single-file flow
def basic_hourly_processing(input_path, result_path):
    data = list(load_clean_data(input_path))
    grouped = categorize_by_hour(data)
    export_summary(result_path, grouped)


if __name__ == "__main__":
    csv_source = "time_series.csv"
    csv_output = "hourly_result.csv"
    # ===============================================
    # 1
    basic_hourly_processing(csv_source, csv_output)
    # ===============================================
    # ===============================================
    # 2
    # segment_and_process_by_date(csv_source, csv_output)
    # ===============================================

    # ===========================================
    # 3
    # Idea for calculating hourly averages in real-time:
    #
    # For every new value (new_value) received, we generate a key based on the exact date and hour
    # for example: "08/04/2025 13:00".
    #
    # We store a dictionary where each key maps to a tuple of: total sum and count.
    # When a new value arrives for the same key:
    # - Add it to the total sum
    # - Increment the count
    # - Calculate the new average: sum / count
    #
    # This allows us to maintain real-time hourly averages, without storing all raw data.
    #

    # ========================================
    # 4
    # Why use Parquet instead of CSV?
    #
    # Parquet allows for direct column access, meaning if we want to calculate hourly averages,
    # we can read only the 'timestamp' and 'value' columns without loading the entire file into memory.
    #
    # Another advantage is that Parquet stores data types (like timestamps and floats) natively,
    # unlike CSV where everything is stored as a string saving unnecessary conversions.
    #
    # This is ideal for time-based analysis, date-range filtering, and fast sorting with less memory overhead.
    # ===============================================
