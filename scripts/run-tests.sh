#!/bin/bash

# Comprehensive test suite runner
# Usage: ./scripts/run-tests.sh

set -e

echo "=========================================="
echo "Dashboard Performance Test Suite"
echo "=========================================="
echo ""

# Check if production build exists
if [ ! -d ".next" ]; then
  echo "Building production bundle..."
  npm run build
fi

echo ""
echo "1. Starting production server..."
npm run start &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Check if server is running
if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
  echo "ERROR: Server failed to start"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi

echo "Server is running (PID: $SERVER_PID)"
echo ""

# Test API endpoint
echo "2. Testing API endpoint..."
node scripts/test-api.js http://localhost:3000/api/data
echo ""

# Run Lighthouse
echo "3. Running Lighthouse audit..."
if [ -f "scripts/lighthouse-test.sh" ]; then
  chmod +x scripts/lighthouse-test.sh
  ./scripts/lighthouse-test.sh http://localhost:3000
else
  npx lighthouse http://localhost:3000 \
    --output=json \
    --output-path=./lighthouse-report.json \
    --chrome-flags="--headless" \
    --only-categories=performance
fi
echo ""

# Cleanup
echo "4. Stopping server..."
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "=========================================="
echo "Tests completed!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Check Lighthouse report for performance scores"
echo "2. Open dashboard in Chrome with FPS meter enabled"
echo "3. Monitor memory usage in DevTools"
echo "4. Run stress tests: autocannon or k6"

