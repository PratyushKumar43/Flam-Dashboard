# Performance Testing Guide

This document outlines how to test the dashboard's performance according to the assignment requirements.

## Quick Start

1. **Build and start production server:**
   ```bash
   npm run build
   npm run start
   ```

2. **Open Chrome DevTools:**
   - Press F12
   - Go to Rendering tab
   - Enable "FPS meter"
   - Go to Performance tab for detailed traces

3. **Run automated tests:**
   ```bash
   npm run test:all
   ```

## Test Checklist

### ✅ 1. Functional Correctness

**Test API endpoint:**
```bash
npm run test:api
# or
curl -i http://localhost:3000/api/data
```

**Expected:** JSON response with `fps`, `memory`, and `latency` arrays.

### ✅ 2. FPS Measurement

**Visual FPS Counter:**
- The dashboard includes a built-in FPS counter in the top-right corner
- Green = 60+ FPS (good)
- Yellow = 30-59 FPS (acceptable)
- Red = <30 FPS (needs optimization)

**Chrome DevTools:**
1. Open DevTools → Rendering tab
2. Enable "FPS meter"
3. Watch the meter while dashboard runs
4. Target: Sustained 60 FPS

**Programmatic Measurement:**
- Performance stats are logged automatically
- View in the "Performance Stats" card on the dashboard
- Export metrics as JSON for analysis

### ✅ 3. Memory Stability

**Chrome DevTools:**
1. Open DevTools → Memory tab
2. Take heap snapshot at t=0
3. Let dashboard run for 30 minutes
4. Take another heap snapshot
5. Compare retained objects

**Automated Logging:**
- Memory is logged to console every 60 seconds
- Check browser console for periodic memory reports
- Target: < 1MB growth per hour

**Performance Stats Card:**
- Shows current memory usage
- Updates every second

### ✅ 4. Interaction Latency

**Manual Test:**
1. Open DevTools → Performance tab
2. Click "Record"
3. Perform interactions (zoom, pan, filter)
4. Stop recording
5. Check timeline for event → paint latency
6. Target: < 100ms

**Automated:**
- Interaction latency is tracked in Performance Monitor component
- Shows real-time latency measurements

### ✅ 5. Load & Throughput Stress

**HTTP Stress Test (Autocannon):**
```bash
# Install: npm i -g autocannon
autocannon -c 200 -d 60 -p 10 http://localhost:3000/api/data
```

**WebSocket Stress Test (k6):**
```bash
# Install k6 separately
k6 run --vus 100 --duration 60s scripts/k6_ws.js
```

**Multiple WebSocket Clients:**
```bash
node scripts/spawn-ws-clients.js 200
```

### ✅ 6. Rendering Correctness

**Visual Inspection:**
- Charts should render smoothly
- No flickering or artifacts
- Data updates should be visible

**Screenshot Comparison (Puppeteer):**
```javascript
// Example Puppeteer script
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3000/dashboard');
await page.waitForTimeout(5000); // Wait for stable state
await page.screenshot({ path: 'dashboard.png' });
await browser.close();
```

### ✅ 7. Automated Performance Audit

**Lighthouse:**
```bash
npm run test:lighthouse
# or
npx lighthouse http://localhost:3000 --output=json --output-path=./lh.json --chrome-flags="--headless"
```

**Target Scores:**
- Performance: > 90
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Total Blocking Time: < 200ms

### ✅ 8. Profiling

**React DevTools Profiler:**
1. Install React DevTools extension
2. Open Profiler tab
3. Click "Record"
4. Interact with dashboard
5. Stop recording
6. Analyze component render times
7. Look for expensive renders

**Chrome Performance Tab:**
1. Record performance trace
2. Look for long tasks (> 50ms)
3. Identify bottlenecks
4. Check frame times

### ✅ 9. Web Workers Test

**Verify Worker Usage:**
- Open DevTools → Sources tab
- Check for worker threads
- Verify data processing happens off main thread

**Toggle Test:**
- Compare performance with/without workers
- Workers should improve frame times

## Acceptance Criteria

### ✅ Sustained Performance
- **10,000 points with 100ms updates:** p95 frame time < 16ms (60 FPS)
- **Interaction latency:** median < 100ms
- **Memory growth:** < 1MB per hour over 2 hours
- **No dropped updates:** All data points rendered

### ✅ Metrics to Report

1. **FPS Trace Screenshot**
   - Chrome DevTools FPS meter
   - Performance Stats export

2. **Heap Snapshots**
   - t=0 snapshot
   - t=30min snapshot
   - Comparison showing < 1MB growth

3. **Stress Test Output**
   - Autocannon results
   - k6 results
   - WebSocket client logs

4. **Lighthouse Report**
   - JSON export
   - Performance score
   - Core Web Vitals

## Troubleshooting

### Low FPS
- Check for expensive renders (React Profiler)
- Move heavy computation to Web Workers
- Reduce DOM updates
- Use `React.memo` for expensive components
- Batch state updates with `useTransition`

### Memory Leaks
- Check for event listeners not cleaned up
- Verify `useEffect` cleanup functions
- Look for growing arrays/objects
- Use heap snapshots to find retained objects

### High Latency
- Offload aggregation to workers
- Reduce canvas redraws
- Use `requestAnimationFrame` efficiently
- Minimize synchronous operations

## Test Scripts

All test scripts are in the `scripts/` directory:

- `test-api.js` - Test API endpoint
- `ws-client.js` - WebSocket client for testing
- `spawn-ws-clients.js` - Spawn multiple clients
- `k6_ws.js` - k6 WebSocket stress test
- `lighthouse-test.sh` - Lighthouse audit
- `run-tests.sh` - Run all tests

## References

- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse CLI](https://www.npmjs.com/package/lighthouse)
- [Autocannon](https://github.com/mcollina/autocannon)
- [k6 WebSocket Testing](https://grafana.com/docs/k6/latest/using-k6/protocols/websockets/)

