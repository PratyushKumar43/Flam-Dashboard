import type { DataPoint, TimeSeriesData, AggregatedData, AggregationPeriod } from './types'

/**
 * Generates realistic time-series data for performance telemetry
 */
export function generateTimeSeriesData(
  count: number,
  startTime: number = Date.now() - 3600000, // Default: last hour
  baseValue: number = 60,
  variance: number = 5
): DataPoint[] {
  const points: DataPoint[] = []
  const interval = (Date.now() - startTime) / count

  for (let i = 0; i < count; i++) {
    const timestamp = startTime + i * interval
    // Generate realistic FPS-like data with slight variations
    const noise = (Math.random() - 0.5) * variance
    const trend = Math.sin((i / count) * Math.PI * 2) * 2 // Slow sine wave
    const value = Math.max(30, Math.min(90, baseValue + noise + trend))
    
    points.push({
      timestamp,
      value: Math.round(value * 10) / 10,
    })
  }

  return points
}

/**
 * Generates multiple data series for different metrics
 */
export function generateMultiSeriesData(
  count: number,
  startTime: number = Date.now() - 3600000
): {
  fps: DataPoint[]
  memory: DataPoint[]
  latency: DataPoint[]
} {
  return {
    fps: generateTimeSeriesData(count, startTime, 60, 3),
    memory: generateTimeSeriesData(count, startTime, 0.6, 0.1).map(p => ({
      ...p,
      value: Math.max(0, p.value),
    })),
    latency: generateTimeSeriesData(count, startTime, 85, 10).map(p => ({
      ...p,
      value: Math.max(50, Math.min(150, p.value)),
    })),
  }
}

/**
 * Aggregates data points by time period
 */
export function aggregateData(
  points: DataPoint[],
  period: AggregationPeriod
): AggregatedData[] {
  const periodMs: Record<AggregationPeriod, number> = {
    '1min': 60000,
    '5min': 300000,
    '1hour': 3600000,
  }

  const interval = periodMs[period]
  const aggregated: Map<number, DataPoint[]> = new Map()

  // Group points by time period
  for (const point of points) {
    const periodStart = Math.floor(point.timestamp / interval) * interval
    if (!aggregated.has(periodStart)) {
      aggregated.set(periodStart, [])
    }
    aggregated.get(periodStart)!.push(point)
  }

  // Calculate aggregates for each period
  const result: AggregatedData[] = []
  for (const [timestamp, periodPoints] of aggregated.entries()) {
    const values = periodPoints.map(p => p.value)
    result.push({
      period,
      timestamp,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      count: values.length,
    })
  }

  return result.sort((a, b) => a.timestamp - b.timestamp)
}

/**
 * Calculates statistics for a time series
 */
export function calculateStats(points: DataPoint[]): TimeSeriesData {
  if (points.length === 0) {
    return {
      points: [],
      startTime: 0,
      endTime: 0,
      min: 0,
      max: 0,
      avg: 0,
    }
  }

  const values = points.map(p => p.value)
  const timestamps = points.map(p => p.timestamp)

  return {
    points,
    startTime: Math.min(...timestamps),
    endTime: Math.max(...timestamps),
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
  }
}

/**
 * Generates a stream of data points at specified interval
 */
export function* generateDataStream(
  intervalMs: number = 100,
  count: number = Infinity,
  baseValue: number = 60,
  variance: number = 5
): Generator<DataPoint, void, unknown> {
  let generated = 0
  const baseTime = Date.now()

  while (generated < count) {
    const timestamp = baseTime + generated * intervalMs
    const noise = (Math.random() - 0.5) * variance
    const trend = Math.sin((generated / 100) * Math.PI * 2) * (variance * 0.3) // Slow sine wave
    const value = baseValue + noise + trend
    yield {
      timestamp,
      value: Math.round(value * 10) / 10,
    }
    generated++
  }
}

