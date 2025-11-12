/**
 * Performance logging utilities for monitoring dashboard performance
 */

interface PerformanceMetrics {
  fps: number
  frameTime: number
  memory?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
  timestamp: number
}

const metrics: PerformanceMetrics[] = []
const MAX_METRICS = 1000

export function logPerformance(metric: Omit<PerformanceMetrics, 'timestamp'>) {
  metrics.push({
    ...metric,
    timestamp: Date.now(),
  })

  // Keep only last MAX_METRICS
  if (metrics.length > MAX_METRICS) {
    metrics.shift()
  }
}

export function getPerformanceStats() {
  if (metrics.length === 0) return null

  const fpsValues = metrics.map(m => m.fps)
  const frameTimes = metrics.map(m => m.frameTime)

  return {
    fps: {
      min: Math.min(...fpsValues),
      max: Math.max(...fpsValues),
      avg: fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length,
      p50: percentile(fpsValues, 50),
      p95: percentile(fpsValues, 95),
      p99: percentile(fpsValues, 99),
    },
    frameTime: {
      min: Math.min(...frameTimes),
      max: Math.max(...frameTimes),
      avg: frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length,
      p50: percentile(frameTimes, 50),
      p95: percentile(frameTimes, 95),
      p99: percentile(frameTimes, 99),
    },
    memory: metrics
      .filter(m => m.memory)
      .map(m => m.memory!)
      .reduce(
        (acc, m) => {
          acc.used = Math.max(acc.used, m.usedJSHeapSize)
          acc.total = Math.max(acc.total, m.totalJSHeapSize)
          acc.limit = m.jsHeapSizeLimit
          return acc
        },
        { used: 0, total: 0, limit: 0 }
      ),
    sampleCount: metrics.length,
  }
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const sortedCopy = [...sorted].sort((a, b) => a - b)
  const index = Math.ceil((p / 100) * sortedCopy.length) - 1
  return sortedCopy[Math.max(0, index)]
}

export function exportMetrics(): string {
  return JSON.stringify(metrics, null, 2)
}

export function clearMetrics() {
  metrics.length = 0
}

// Periodic memory logging (Chromium only)
if (typeof window !== 'undefined') {
  setInterval(() => {
    // @ts-ignore
    if (performance?.memory) {
      const mem = (performance as any).memory
      console.log('Memory:', {
        used: (mem.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        total: (mem.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        limit: (mem.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
        timestamp: new Date().toISOString(),
      })
    }
  }, 60000) // Every minute
}

