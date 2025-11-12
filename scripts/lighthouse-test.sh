#!/bin/bash

# Lighthouse performance audit script
# Usage: ./scripts/lighthouse-test.sh [url]

URL=${1:-"http://localhost:3000"}
OUTPUT_DIR="./lighthouse-reports"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "Running Lighthouse audit on $URL..."
echo "Output directory: $OUTPUT_DIR"

mkdir -p "$OUTPUT_DIR"

npx lighthouse "$URL" \
  --output=json \
  --output=html \
  --output-path="$OUTPUT_DIR/lighthouse-$TIMESTAMP" \
  --chrome-flags="--headless --no-sandbox" \
  --only-categories=performance \
  --quiet

echo "Lighthouse report saved to: $OUTPUT_DIR/lighthouse-$TIMESTAMP.json"
echo "HTML report saved to: $OUTPUT_DIR/lighthouse-$TIMESTAMP.html"

