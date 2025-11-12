'use client'

import { useRef, useEffect, useCallback, useMemo } from 'react'
import type { DataPoint, ChartConfig, Viewport } from '@/lib/types'
import { clearCanvas, drawGrid, drawAxes } from '@/lib/canvasUtils'

interface UseChartRendererOptions {
  canvasRef: React.RefObject<HTMLCanvasElement>
  data: DataPoint[]
  chartConfig: ChartConfig
  viewport: Viewport
  renderChart: (ctx: CanvasRenderingContext2D, data: DataPoint[], config: ChartConfig, viewport: Viewport) => void
  color?: string
  gridColor?: string
}

/**
 * Custom hook for efficient chart rendering with Canvas
 * Handles requestAnimationFrame optimization and cleanup
 */
export function useChartRenderer({
  canvasRef,
  data,
  chartConfig,
  viewport,
  renderChart,
  color = '#3b82f6',
  gridColor = '#e5e7eb',
}: UseChartRendererOptions) {
  const animationFrameRef = useRef<number | null>(null)
  const lastRenderTimeRef = useRef<number>(0)
  const isRenderingRef = useRef(false)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    clearCanvas(ctx, viewport.width, viewport.height, '#ffffff')

    // Draw grid
    drawGrid(ctx, chartConfig, viewport, gridColor, 1)

    // Render chart
    if (data.length > 0) {
      renderChart(ctx, data, chartConfig, viewport)
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
  }, [canvasRef, data, chartConfig, viewport, renderChart, gridColor])

  const animate = useCallback(() => {
    const now = performance.now()
    // Throttle to ~60fps (16.67ms per frame)
    if (now - lastRenderTimeRef.current >= 16) {
      render()
      lastRenderTimeRef.current = now
    }
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [render])

  useEffect(() => {
    if (isRenderingRef.current) return

    isRenderingRef.current = true
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      isRenderingRef.current = false
    }
  }, [animate])

  // Force immediate render when data/config changes significantly
  useEffect(() => {
    render()
  }, [data.length, chartConfig.width, chartConfig.height, render])

  return {
    render,
    isRendering: isRenderingRef.current,
  }
}

