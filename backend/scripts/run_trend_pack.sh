#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/out"
mkdir -p "$OUT"

python3 "$ROOT/trends/scrape_trends.py" \
  --urls \
  "https://news.ycombinator.com/" \
  "https://www.socialmediatoday.com/" \
  "https://blog.hootsuite.com/" \
  --out "$OUT/trend_signals.json" \
  --limit 20

echo "Trend pack ready: $OUT/trend_signals.json"
