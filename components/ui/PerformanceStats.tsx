'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getPerformanceStats, exportMetrics, clearMetrics } from '@/lib/performanceLogger'

export function PerformanceStats() {
  const [stats, setStats] = useState<ReturnType<typeof getPerformanceStats>>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getPerformanceStats())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleExport = () => {
    const data = exportMetrics()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-metrics-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Stats</CardTitle>
          <CardDescription>Collecting metrics...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Stats</CardTitle>
        <CardDescription>Frame timing and FPS statistics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">FPS (avg)</div>
            <div className="text-2xl font-bold">{stats.fps.avg.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">FPS (p95)</div>
            <div className="text-2xl font-bold">{stats.fps.p95.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Frame Time (avg)</div>
            <div className="text-2xl font-bold">{stats.frameTime.avg.toFixed(2)} ms</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Frame Time (p95)</div>
            <div className="text-2xl font-bold">{stats.frameTime.p95.toFixed(2)} ms</div>
          </div>
        </div>

        {stats.memory && stats.memory.used > 0 && (
          <div>
            <div className="text-sm text-muted-foreground">Memory Usage</div>
            <div className="text-lg font-semibold">
              {(stats.memory.used / 1048576).toFixed(2)} MB / {(stats.memory.limit / 1048576).toFixed(2)} MB
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm" className="text-foreground">
            Export Metrics
          </Button>
          <Button onClick={clearMetrics} variant="outline" size="sm" className="text-foreground">
            Clear
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Samples: {stats.sampleCount} | Target: 60 FPS, &lt;16ms frame time
        </div>
      </CardContent>
    </Card>
  )
}

