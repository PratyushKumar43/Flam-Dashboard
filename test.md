Action plan — concrete tests, commands, and scripts to prove your dashboard is *actually* real-time and not “just simulated.” Run these now against your local production build (`npm run build && npm run start`) or deployed URL.

# Quick checklist (do these first)

1. Build production and serve: `npm run build && npm run start`.
2. Open Chrome, enable Rendering → FPS meter. Use DevTools Performance tab for traces. ([Chrome for Developers][1])
3. Run automated Lighthouse audit headless for baseline metrics. ([npm][2])

# 1 — Functional correctness (is real-time data actually applied to the canvas)

Run the app in production mode and verify data flows through the same route your UI consumes (HTTP SSE / WebSocket / polling).

* Confirm server route responds: `curl -i http://localhost:3000/api/data` (or your route).
* If using WebSockets, run a single client to log incoming messages:

```js
// scripts/ws-client.js
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:3000/api/realtime');
ws.on('message', m => console.log('msg', m.toString().slice(0,200)));
```

* Verify UI reflects the same messages (open console and network frames); capture a few messages to prove parity.

# 2 — Measure FPS & frame stability (60 FPS target)

A. Quick visual: enable Chrome → Rendering → FPS meter. Watch while the dashboard runs. ([Chrome for Developers][3])
B. Embedded FPS counter (add to UI for reproducible measurement):

```ts
// components/ui/FPSCounter.tsx (client)
'use client';
import { useEffect, useRef, useState } from 'react';
export default function FPSCounter(){
  const last = useRef<number>(performance.now());
  const frames = useRef<number>(0);
  const [fps,setFps] = useState(0);
  useEffect(()=>{
    let raf = 0;
    const loop = (t:number)=>{
      frames.current++;
      if (t - last.current >= 1000){
        setFps(frames.current);
        frames.current = 0;
        last.current = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return ()=> cancelAnimationFrame(raf);
  },[]);
  return <div style={{position:'fixed',right:8,top:8,background:'#000',color:'#fff',padding:6}}>FPS: {fps}</div>;
}
```

C. Programmatic frame timing: instrument `requestAnimationFrame` render loop to collect frame times and compute percentiles (p50/p95/p99). Persist logs to console or endpoint.

# 3 — Memory stability (no leaks)

1. Open DevTools → Memory → take heap snapshot at t=0, then again after 30min of continuous running. Compare retained objects and allocations. Use `Allocation instrumentation on timeline` to find growing objects. ([Chrome for Developers][3])
2. Add periodic `performance.memory` logging (Chromium only) to detect monotonic growth:

```ts
setInterval(()=>{
  // @ts-ignore
  if (performance?.memory) console.log('mem', performance.memory);
}, 60000);
```

Pass criteria: heap growth < 1MB/hr (your assignment target).

# 4 — Interaction latency (<100ms)

* Use DevTools Performance → Record a profile while performing interactions (zoom, pan, filters). Measure end-to-end time from input event to next paint.
* Embed timestamps in event handlers to log delta between user action and canvas paint commit.

# 5 — Load & throughput stress (10k+ points, sustained updates)

A. HTTP stress for API endpoints (autocannon):

```bash
# install: npm i -g autocannon
autocannon -c 200 -d 60 -p 10 http://localhost:3000/api/data
```

Autocannon provides throughput/latency. ([GitHub][4])

B. WebSocket stress (k6 example for websockets):

```js
// k6_ws.js
import ws from 'k6/ws';
import { sleep } from 'k6';
export default function() {
  const url = 'ws://localhost:3000/api/realtime';
  const res = ws.connect(url, null, function(socket){
    socket.on('open', ()=>{});
    socket.on('message', m => {});
    socket.on('close', ()=>{});
  });
  sleep(1);
}
```

Run: `k6 run --vus 100 --duration 30s k6_ws.js`. Use k6 for realistic concurrent socket behavior and metrics. ([Grafana Labs][5])

C. Simulate many clients via Node (spawn N headless clients):

```js
// scripts/spawn-ws-clients.js
const { fork } = require('child_process');
const N = process.argv[2]||200;
for(let i=0;i<N;i++){
  fork('./scripts/ws-client.js');
}
```

Use to validate server scalability and to observe CPU/latency on server.

# 6 — Verify rendering correctness under load (visual regression)

A. Use Puppeteer / Playwright to capture screenshots at intervals and diff against baseline:

* Capture screenshot: Puppeteer + pixelmatch or ImageMagick for diffs. ([Stack Overflow][6])
* Example flow:

  1. Start prod server.
  2. Puppeteer loads page, waits for stable state, screenshots.
  3. Compare with baseline. Failing diffs indicate rendering anomalies under stress.

# 7 — Automated performance audit (CI)

* Run headless Lighthouse in CI against your deployed build:

```bash
npx lighthouse http://localhost:3000 --output=json --output-path=lh.json --chrome-flags="--headless"
```

Store results and assert thresholds (e.g., first-contentful-paint < 1s, interactive < 100ms). ([npm][2])

# 8 — Profiling and hot spots

* Server: use `clinic` / `0x` / node inspector to profile CPU / event loop stalls.
* Client: React DevTools Profiler to measure component render times; use flamegraphs to find repeated expensive renders. Use `useMemo`, `React.memo`, and move heavy aggregation to Web Worker.
* Canvas: ensure `requestAnimationFrame` is the only per-frame work and heavy per-frame computation is offloaded to Web Worker / OffscreenCanvas.

# 9 — Web Workers & OffscreenCanvas test

* Move data aggregation to a worker, render frames from main thread only. Validate by toggling worker on/off and measuring frame times. Use `performance.mark/measure` to compare.

# 10 — Acceptance criteria (concrete)

* Sustained run at 10,000 points with live updates every 100ms: p95 frame time < 16ms (i.e., 60fps) OR p99 < 33ms depending on distribution.
* Interaction latency (zoom/pan/filter) median < 100ms.
* Memory growth < 1MB per hour over 2 hours of runtime.
* No dropped updates: confirm by logging server-sent message count vs frames rendered count (difference should be zero or acceptable buffer losses).

# Quick commands summary (paste-and-run)

```bash
# build & start prod
npm run build
npm run start

# headless lighthouse
npx lighthouse http://localhost:3000 --output=json --output-path=lh.json --chrome-flags="--headless"

# autocannon HTTP load
autocannon -c 200 -d 60 -p 10 http://localhost:3000/api/data

# run k6 websocket (install k6 separately)
k6 run --vus 100 --duration 60s k6_ws.js
```

# Troubleshooting checklist if you fail tests

* Confirm production build used (dev mode hides performance issues).
* Offload aggregation from render loop (move to worker).
* Reduce DOM/SVG updates; draw on Canvas only.
* Batch state updates with `useTransition`/`startTransition`.
* Use virtualization for tables.
* Capture full performance trace (DevTools → Save trace) and inspect long tasks.

# References & tool docs used

* Lighthouse CLI + Chrome DevTools performance docs. ([npm][2])
* Chrome DevTools FPS meter and performance reference. ([Chrome for Developers][3])
* Autocannon (HTTP benchmarking). ([GitHub][4])
* k6 WebSocket docs and examples. ([Grafana Labs][5])
* Puppeteer screenshot comparison / image diff examples. ([Stack Overflow][6])

Run these tests now against your production build and report failures with: (1) FPS trace screenshot, (2) heap snapshots (t=0 and t=30min), (3) stress-test output (autocannon/k6), (4) Lighthouse report JSON.

[1]: https://developer.chrome.com/docs/lighthouse/overview?utm_source=chatgpt.com "Introduction to Lighthouse - Chrome for Developers"
[2]: https://www.npmjs.com/package/lighthouse?utm_source=chatgpt.com "lighthouse"
[3]: https://developer.chrome.com/docs/devtools/performance/reference?utm_source=chatgpt.com "Performance features reference | Chrome DevTools"
[4]: https://github.com/mcollina/autocannon?utm_source=chatgpt.com "mcollina/autocannon: fast HTTP/1.1 benchmarking tool ..."
[5]: https://grafana.com/docs/k6/latest/using-k6/protocols/websockets/?utm_source=chatgpt.com "WebSockets | Grafana k6 documentation"
[6]: https://stackoverflow.com/questions/53820712/is-it-possible-to-use-puppeteer-to-compare-a-screenshot-with-the-ui-elements-of?utm_source=chatgpt.com "Is it possible to use puppeteer to compare a screenshot ..."
