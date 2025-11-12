import type { DataPoint, ChartConfig, Viewport } from './types'

/**
 * Converts data point to canvas coordinates
 */
export function pointToCanvas(
  point: DataPoint,
  config: ChartConfig,
  viewport: Viewport
): { x: number; y: number } {
  const { padding, xScale, yScale } = config
  const { width, height, scale } = viewport

  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Map timestamp to x coordinate
  const xRange = xScale.max - xScale.min
  const xRatio = (point.timestamp - xScale.min) / xRange
  const x = padding.left + xRatio * chartWidth * scale

  // Map value to y coordinate (inverted: higher values at top)
  const yRange = yScale.max - yScale.min
  const yRatio = (point.value - yScale.min) / yRange
  const y = padding.top + (1 - yRatio) * chartHeight * scale

  return { x, y }
}

/**
 * Draws a line chart on canvas
 */
export function drawLineChart(
  ctx: CanvasRenderingContext2D,
  points: DataPoint[],
  config: ChartConfig,
  viewport: Viewport,
  color: string = '#3b82f6',
  lineWidth: number = 2
): void {
  if (points.length === 0) return

  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()

  const firstPoint = pointToCanvas(points[0], config, viewport)
  ctx.moveTo(firstPoint.x, firstPoint.y)

  for (let i = 1; i < points.length; i++) {
    const point = pointToCanvas(points[i], config, viewport)
    ctx.lineTo(point.x, point.y)
  }

  ctx.stroke()
  ctx.restore()
}

/**
 * Draws a bar chart on canvas
 */
export function drawBarChart(
  ctx: CanvasRenderingContext2D,
  points: DataPoint[],
  config: ChartConfig,
  viewport: Viewport,
  color: string = '#3b82f6',
  barWidth: number = 4
): void {
  if (points.length === 0) return

  const { padding, yScale } = config
  const { height } = viewport
  const chartHeight = height - padding.top - padding.bottom
  const zeroY = padding.top + chartHeight

  ctx.save()
  ctx.fillStyle = color

  for (const point of points) {
    const { x, y } = pointToCanvas(point, config, viewport)
    const barHeight = zeroY - y

    ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight)
  }

  ctx.restore()
}

/**
 * Draws a scatter plot on canvas
 */
export function drawScatterPlot(
  ctx: CanvasRenderingContext2D,
  points: DataPoint[],
  config: ChartConfig,
  viewport: Viewport,
  color: string = '#3b82f6',
  radius: number = 3
): void {
  if (points.length === 0) return

  ctx.save()
  ctx.fillStyle = color

  for (const point of points) {
    const { x, y } = pointToCanvas(point, config, viewport)
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

/**
 * Draws a heatmap on canvas
 */
export function drawHeatmap(
  ctx: CanvasRenderingContext2D,
  points: DataPoint[],
  config: ChartConfig,
  viewport: Viewport,
  cellSize: number = 10
): void {
  if (points.length === 0) return

  const { padding } = config
  const { width, height } = viewport
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Create grid
  const cols = Math.floor(chartWidth / cellSize)
  const rows = Math.floor(chartHeight / cellSize)

  // Calculate value ranges for color mapping
  const values = points.map(p => p.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const valueRange = maxValue - minValue || 1

  // Map points to grid cells
  const grid: Map<string, number[]> = new Map()
  for (const point of points) {
    const { x, y } = pointToCanvas(point, config, viewport)
    const col = Math.floor((x - padding.left) / cellSize)
    const row = Math.floor((y - padding.top) / cellSize)
    const key = `${col},${row}`

    if (!grid.has(key)) {
      grid.set(key, [])
    }
    grid.get(key)!.push(point.value)
  }

  // Draw heatmap cells
  for (const [key, cellValues] of grid.entries()) {
    const [col, row] = key.split(',').map(Number)
    const avgValue = cellValues.reduce((a, b) => a + b, 0) / cellValues.length
    const intensity = (avgValue - minValue) / valueRange

    // Color gradient: blue (low) -> yellow (medium) -> red (high)
    const r = Math.min(255, intensity * 510)
    const g = Math.min(255, 255 - Math.abs(intensity - 0.5) * 510)
    const b = Math.max(0, 255 - intensity * 510)

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    ctx.fillRect(
      padding.left + col * cellSize,
      padding.top + row * cellSize,
      cellSize,
      cellSize
    )
  }
}

/**
 * Clears canvas with optional background
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  backgroundColor?: string
): void {
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
  } else {
    ctx.clearRect(0, 0, width, height)
  }
}

/**
 * Draws grid lines on canvas
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  config: ChartConfig,
  viewport: Viewport,
  color: string = '#e5e7eb',
  lineWidth: number = 1
): void {
  const { padding } = config
  const { width, height } = viewport

  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth

  // Vertical lines
  const verticalLines = 5
  for (let i = 0; i <= verticalLines; i++) {
    const x = padding.left + (i / verticalLines) * (width - padding.left - padding.right)
    ctx.beginPath()
    ctx.moveTo(x, padding.top)
    ctx.lineTo(x, height - padding.bottom)
    ctx.stroke()
  }

  // Horizontal lines
  const horizontalLines = 5
  for (let i = 0; i <= horizontalLines; i++) {
    const y = padding.top + (i / horizontalLines) * (height - padding.top - padding.bottom)
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(width - padding.right, y)
    ctx.stroke()
  }

  ctx.restore()
}

/**
 * Draws axes labels
 */
export function drawAxes(
  ctx: CanvasRenderingContext2D,
  config: ChartConfig,
  viewport: Viewport,
  xLabels: string[],
  yLabels: string[],
  color: string = '#6b7280',
  fontSize: number = 12
): void {
  const { padding } = config
  const { width, height } = viewport

  ctx.save()
  ctx.fillStyle = color
  ctx.font = `${fontSize}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  // X-axis labels
  const xStep = (width - padding.left - padding.right) / (xLabels.length - 1)
  for (let i = 0; i < xLabels.length; i++) {
    const x = padding.left + i * xStep
    ctx.fillText(xLabels[i], x, height - padding.bottom + 5)
  }

  // Y-axis labels
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  const yStep = (height - padding.top - padding.bottom) / (yLabels.length - 1)
  for (let i = 0; i < yLabels.length; i++) {
    const y = padding.top + (yLabels.length - 1 - i) * yStep
    ctx.fillText(yLabels[i], padding.left - 10, y)
  }

  ctx.restore()
}

