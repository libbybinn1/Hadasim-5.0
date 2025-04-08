import os
from collections import Counter
import heapq

# Configuration
LOG_FILE = "logs.txt"
CHUNK_SIZE = 10**6
N = 3

def split_log_file(log_file, chunk_size):
    """Split the log file into smaller chunks."""
    part_files = []
    with open(log_file, "r", encoding="utf-8") as file:
        for part_number, chunk in enumerate(iter(lambda: list(file.readline().strip() for _ in range(chunk_size)), [])):
            chunk = [line for line in chunk if line]  # Remove empty lines
            if not chunk:
                break

            part_filename = f"part_{part_number}.txt"
            with open(part_filename, "w", encoding="utf-8") as part_file:
                part_file.write("\n".join(chunk))
            part_files.append(part_filename)

    return part_files

def count_errors_in_chunk(chunk_file):
    """Count error codes in a given chunk file."""
    counter = Counter()
    with open(chunk_file, "r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if line:  # Ensure the line is not empty
                counter[line] += 1
    return counter

def merge_counters(counters):
    """Merge multiple Counter objects into a single Counter."""
    total_counter = Counter()
    for counter in counters:
        total_counter.update(counter)
    return total_counter

def find_top_n_errors(error_counts, n):
    """Find the N most common error codes."""
    return heapq.nlargest(n, error_counts.items(), key=lambda x: x[1])

def process_logs(log_file, chunk_size, n):
    """Process the log file to find the top N error codes."""
    print(" Splitting log file into smaller chunks...")
    part_files = split_log_file(log_file, chunk_size)

    print(" Counting error codes in each chunk...")
    counters = [count_errors_in_chunk(part) for part in part_files]

    print(" Merging error counts...")
    total_counts = merge_counters(counters)

    print(" Finding top N most common error codes...")
    top_errors = find_top_n_errors(total_counts, n)

    # Clean up temporary chunk files
    for part_file in part_files:
        os.remove(part_file)

    return top_errors

if __name__ == "__main__":
    top_errors = process_logs(LOG_FILE, CHUNK_SIZE, N)
    print("\n Top N most common error codes:")
    for code, count in top_errors:
        print(f"{code}: {count}")

# Time Complexity:
#
# Splitting log file: O(L), where L is the total number of lines in the log file.
#
# Counting errors in chunks: O(L).
#
# Merging counters: O(K)(K ≤ L).
#
# Finding top N errors: O(K log N).
#
# Overall time complexity: O(L + L log N), which simplifies to O(L log N).
#
# Space Complexity:
#
# Splitting log file: O(L).
#
# Counting errors in chunks: O(C) per chunk.
#
# Merging counters: O(K).
#
# Overall space complexity: O(L).( O(L + K))
