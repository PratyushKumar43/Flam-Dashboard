'use client'

import { useRef, useEffect, useMemo } from 'react'

interface SimpleAreaChartProps {
  data: Array<{ sample: string; fps: number; latency: number }>
  width?: number
  height?: number
}

export function SimpleAreaChart({ data, width = 400, height = 200 }: SimpleAreaChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const stats = useMemo(() => {
    const fpsValues = data.map(d => d.fps)
    const latencyValues = data.map(d => d.latency)
    return {
      fpsMin: Math.min(...fpsValues),
      fpsMax: Math.max(...fpsValues),
      latencyMin: Math.min(...latencyValues),
      latencyMax: Math.max(...latencyValues),
    }
  }, [data])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    const padding = { top: 20, right: 20, bottom: 30, left: 40 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Draw grid
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()
    }

    // Draw FPS area
    const fpsRange = stats.fpsMax - stats.fpsMin || 1
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i < data.length; i++) {
      const x = padding.left + (i / (data.length - 1)) * chartWidth
      const y = padding.top + chartHeight - ((data[i].fps - stats.fpsMin) / fpsRange) * chartHeight
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
    ctx.lineTo(padding.left, padding.top + chartHeight)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw latency area
    const latencyRange = stats.latencyMax - stats.latencyMin || 1
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'
    ctx.strokeStyle = '#10b981'
    ctx.beginPath()
    for (let i = 0; i < data.length; i++) {
      const x = padding.left + (i / (data.length - 1)) * chartWidth
      const y = padding.top + chartHeight - ((data[i].latency - stats.latencyMin) / latencyRange) * chartHeight
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
    ctx.lineTo(padding.left, padding.top + chartHeight)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw labels
    ctx.fillStyle = '#6b7280'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    for (let i = 0; i < data.length; i += Math.ceil(data.length / 5)) {
      const x = padding.left + (i / (data.length - 1)) * chartWidth
      ctx.fillText(data[i].sample, x, height - padding.bottom + 15)
    }

    // Y-axis labels
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight
      const value = stats.fpsMax - (i / 5) * (stats.fpsMax - stats.fpsMin)
      ctx.fillText(value.toFixed(0), padding.left - 10, y)
    }
  }, [data, width, height, stats])

  return (
    <div className="w-full">
      <canvas ref={canvasRef} width={width} height={height} className="w-full" />
      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span>FPS</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span>Latency (ms)</span>
        </div>
      </div>
    </div>
  )
}

