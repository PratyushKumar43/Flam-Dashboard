export interface DataPoint {
  timestamp: number
  value: number
  category?: string
}

export interface TimeSeriesData {
  points: DataPoint[]
  startTime: number
  endTime: number
  min: number
  max: number
  avg: number
}

export interface AggregatedData {
  period: string
  timestamp: number
  min: number
  max: number
  avg: number
  count: number
}

export interface ChartConfig {
  width: number
  height: number
  padding: {
    top: number
    right: number
    bottom: number
    left: number
  }
  xScale: {
    min: number
    max: number
  }
  yScale: {
    min: number
    max: number
  }
}

export interface Viewport {
  x: number
  y: number
  width: number
  height: number
  scale: number
}

export interface PerformanceMetrics {
  fps: number
  memory: number
  renderTime: number
  interactionLatency: number
  timestamp: number
}

export interface ChartProps {
  data: DataPoint[]
  width?: number
  height?: number
  onZoom?: (viewport: Viewport) => void
  onPan?: (viewport: Viewport) => void
}

export type AggregationPeriod = '1min' | '5min' | '1hour'

