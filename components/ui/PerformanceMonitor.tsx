'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'

export function PerformanceMonitor() {
  const { metrics } = usePerformanceMonitor({ enabled: true })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Real-time performance monitoring</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">FPS</div>
            <div className="text-2xl font-bold">{metrics.fps}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Memory</div>
            <div className="text-2xl font-bold">{metrics.memory.toFixed(2)} MB</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Render Time</div>
            <div className="text-2xl font-bold">{metrics.renderTime.toFixed(2)} ms</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Interaction Latency</div>
            <div className="text-2xl font-bold">{metrics.interactionLatency.toFixed(2)} ms</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

