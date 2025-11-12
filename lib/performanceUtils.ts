/**
 * Performance utility functions for monitoring and optimization
 */

export interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage: number
  renderTime: number
  interactionLatency: number
}

export interface PerformanceStats {
  min: number
  max: number
  avg: number
  p50: number
  p95: number
  p99: number
}

/**
 * Measures frame time and calculates FPS
 */
export function measureFPS(sampleInterval: number = 1000): {
  getFPS: () => number
  reset: () => void
} {
  let frameCount = 0
  let lastTime = performance.now()
  let fps = 60

  const countFrame = () => {
    frameCount++
    const now = performance.now()
    const elapsed = now - lastTime

    if (elapsed >= sampleInterval) {
      fps = Math.round((frameCount * 1000) / elapsed)
      frameCount = 0
      lastTime = now
    }

    requestAnimationFrame(countFrame)
  }

  countFrame()

  return {
    getFPS: () => fps,
    reset: () => {
      frameCount = 0
      lastTime = performance.now()
    },
  }
}

/**
 * Measures memory usage (Chrome only)
 */
export function getMemoryUsage(): number | null {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return memory.usedJSHeapSize / 1048576 // Convert to MB
  }
  return null
}

/**
 * Measures render time for a function
 */
export function measureRenderTime<T>(fn: () => T): { result: T; renderTime: number } {
  const start = performance.now()
  const result = fn()
  const renderTime = performance.now() - start
  return { result, renderTime }
}

/**
 * Measures interaction latency
 */
export function measureInteractionLatency(callback: () => void): Promise<number> {
  return new Promise((resolve) => {
    const start = performance.now()
    callback()
    requestAnimationFrame(() => {
      const latency = performance.now() - start
      resolve(latency)
    })
  })
}

/**
 * Calculates performance statistics from an array of values
 */
export function calculatePerformanceStats(values: number[]): PerformanceStats {
  if (values.length === 0) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      p50: 0,
      p95: 0,
      p99: 0,
    }
  }

  const sorted = [...values].sort((a, b) => a - b)
  const sum = sorted.reduce((a, b) => a + b, 0)

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: sum / sorted.length,
    p50: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    p99: percentile(sorted, 0.99),
  }
}

/**
 * Calculates percentile from sorted array
 */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const index = Math.ceil(sorted.length * p) - 1
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))]
}

/**
 * Throttles function calls to limit execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    } else {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        fn(...args)
      }, delay - (now - lastCall))
    }
  }
}

/**
 * Debounces function calls to delay execution
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

/**
 * Creates a performance mark
 */
export function mark(name: string): void {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name)
  }
}

/**
 * Creates a performance measure between two marks
 */
export function measure(name: string, startMark: string, endMark: string): void {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      performance.measure(name, startMark, endMark)
    } catch (e) {
      // Marks may not exist
    }
  }
}

/**
 * Gets all performance measures
 */
export function getMeasures(): PerformanceMeasure[] {
  if (typeof performance !== 'undefined' && performance.getEntriesByType) {
    return performance.getEntriesByType('measure') as PerformanceMeasure[]
  }
  return []
}

/**
 * Clears all performance marks and measures
 */
export function clearPerformanceMarks(): void {
  if (typeof performance !== 'undefined' && performance.clearMarks) {
    performance.clearMarks()
  }
  if (typeof performance !== 'undefined' && performance.clearMeasures) {
    performance.clearMeasures()
  }
}

