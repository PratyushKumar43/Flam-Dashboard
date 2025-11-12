'use client'

import { useRef, useEffect, useCallback, useState, useMemo, memo } from 'react'
import type { DataPoint, ChartConfig, Viewport } from '@/lib/types'
import { calculateStats } from '@/lib/dataGenerator'
import { clearCanvas, drawHeatmap, drawGrid, drawAxes } from '@/lib/canvasUtils'

interface HeatmapProps {
  data: DataPoint[]
  width?: number
  height?: number
  onZoom?: (viewport: Viewport) => void
  onPan?: (viewport: Viewport) => void
}

export const Heatmap = memo(function Heatmap({
  data,
  width = 800,
  height = 400,
  onZoom,
  onPan,
}: HeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    width,
    height,
    scale: 1,
  })
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

    // Draw heatmap
    if (data.length > 0) {
      const cellSize = Math.max(5, Math.min(20, (viewport.width - chartConfig.padding.left - chartConfig.padding.right) / Math.sqrt(data.length)))
      drawHeatmap(ctx, data, chartConfig, viewport, cellSize)
    }

    // Draw grid
    drawGrid(ctx, chartConfig, viewport, '#e5e7eb', 1)

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
  }, [data, chartConfig, viewport])

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
  }, [viewport, onPan])

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
    </div>
  )
})

