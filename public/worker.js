// Web Worker for data processing
self.onmessage = function(e) {
  const { type, data } = e.data

  switch (type) {
    case 'AGGREGATE': {
      const { points, period } = data
      const periodMs = {
        '1min': 60000,
        '5min': 300000,
        '1hour': 3600000,
      }[period] || 60000

      const interval = periodMs
      const aggregated = new Map()

      // Group points by time period
      for (const point of points) {
        const periodStart = Math.floor(point.timestamp / interval) * interval
        if (!aggregated.has(periodStart)) {
          aggregated.set(periodStart, [])
        }
        aggregated.get(periodStart).push(point.value)
      }

      // Calculate aggregates
      const result = []
      for (const [timestamp, values] of aggregated.entries()) {
        result.push({
          period,
          timestamp,
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          count: values.length,
        })
      }

      self.postMessage({
        type: 'AGGREGATE_RESULT',
        data: result.sort((a, b) => a.timestamp - b.timestamp),
      })
      break
    }

    case 'NORMALIZE': {
      const { points } = data
      const values = points.map(p => p.value)
      const min = Math.min(...values)
      const max = Math.max(...values)
      const range = max - min || 1

      const normalized = points.map(p => ({
        ...p,
        value: (p.value - min) / range,
      }))

      self.postMessage({
        type: 'NORMALIZE_RESULT',
        data: normalized,
      })
      break
    }

    default:
      self.postMessage({ type: 'ERROR', error: 'Unknown message type' })
  }
}

