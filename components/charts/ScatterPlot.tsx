'use client'

import { useRef, useEffect, useCallback, useState, useMemo, memo } from 'react'
import type { DataPoint, ChartConfig, Viewport } from '@/lib/types'
import { calculateStats } from '@/lib/dataGenerator'
import { clearCanvas, drawScatterPlot, drawGrid, drawAxes, pointToCanvas } from '@/lib/canvasUtils'

interface ScatterPlotProps {
  data: DataPoint[]
  width?: number
  height?: number
  color?: string
  onZoom?: (viewport: Viewport) => void
  onPan?: (viewport: Viewport) => void
}

export const ScatterPlot = memo(function ScatterPlot({
  data,
  width = 800,
  height = 400,
  color = '#f59e0b',
  onZoom,
  onPan,
}: ScatterPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    width,
    height,
    scale: 1,
  })
  const [hoverPoint, setHoverPoint] = useState<DataPoint | null>(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })

  const stats = useMemo(() => calculateStats(data), [data])

  const chartConfig: ChartConfig = useMemo(() => {
    const valueRange = stats.max - stats.min || 1
    return {
      width: viewport.width,
      height: viewport.height,
      padding: { top: 20, right: 20, bottom: 40, left: 60 },
      xScale: {
        min: stats.startTime || Date.now() - 3600000,
        max: stats.endTime || Date.now(),
      },
      yScale: {
        min: Math.max(0, stats.min - valueRange * 0.1),
        max: stats.max + valueRange * 0.1,
      },
    }
  }, [viewport, stats])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    clearCanvas(ctx, viewport.width, viewport.height, '#ffffff')

    // Draw grid
    drawGrid(ctx, chartConfig, viewport, '#e5e7eb', 1)

    // Draw scatter plot
    if (data.length > 0) {
      drawScatterPlot(ctx, data, chartConfig, viewport, color, 4)
    }

    // Draw axes labels
    const xLabels = Array.from({ length: 6 }, (_, i) => {
      const time = chartConfig.xScale.min + (chartConfig.xScale.max - chartConfig.xScale.min) * (i / 5)
      return new Date(time).toLocaleTimeString()
    })
    const yLabels = Array.from({ length: 6 }, (_, i) => {
      const value = chartConfig.yScale.min + (chartConfig.yScale.max - chartConfig.yScale.min) * (i / 5)
      return value.toFixed(1)
    })
    drawAxes(ctx, chartConfig, viewport, xLabels, yLabels)
  }, [data, chartConfig, viewport, color])

  useEffect(() => {
    render()
  }, [render])

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.max(0.5, Math.min(5, viewport.scale * delta))
    const newViewport = { ...viewport, scale: newScale }
    setViewport(newViewport)
    onZoom?.(newViewport)
  }, [viewport, onZoom])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true
    dragStartRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      const newViewport = {
        ...viewport,
        x: viewport.x + dx,
        y: viewport.y + dy,
      }
      setViewport(newViewport)
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      onPan?.(newViewport)
    }

    // Update hover point
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect && data.length > 0) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const closest = data.reduce((prev, curr) => {
        const prevPoint = pointToCanvas(prev, chartConfig, viewport)
        const currPoint = pointToCanvas(curr, chartConfig, viewport)
        const prevDist = Math.sqrt(Math.pow(prevPoint.x - x, 2) + Math.pow(prevPoint.y - y, 2))
        const currDist = Math.sqrt(Math.pow(currPoint.x - x, 2) + Math.pow(currPoint.y - y, 2))
        return currDist < prevDist ? curr : prev
      }, data[0])
      setHoverPoint(closest)
    }
  }, [viewport, onPan, data, chartConfig])

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  return (
    <div
      className="relative"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        width={viewport.width}
        height={viewport.height}
        className="block"
      />
      <svg
        ref={svgRef}
        width={viewport.width}
        height={viewport.height}
        className="absolute top-0 left-0 pointer-events-none"
      >
        {hoverPoint && (
          <g>
            <circle
              cx={pointToCanvas(hoverPoint, chartConfig, viewport).x}
              cy={pointToCanvas(hoverPoint, chartConfig, viewport).y}
              r={8}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={2}
            />
            <text
              x={pointToCanvas(hoverPoint, chartConfig, viewport).x}
              y={chartConfig.padding.top - 10}
              textAnchor="middle"
              fill="#f59e0b"
              fontSize={12}
            >
              {hoverPoint.value.toFixed(1)}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
})

