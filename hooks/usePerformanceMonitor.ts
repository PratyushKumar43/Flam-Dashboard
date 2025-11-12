'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { PerformanceMetrics } from '@/lib/types'

interface UsePerformanceMonitorOptions {
  enabled?: boolean
  sampleInterval?: number
}

export function usePerformanceMonitor(options: UsePerformanceMonitorOptions = {}) {
  const { enabled = true, sampleInterval = 1000 } = options
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    renderTime: 0,
    interactionLatency: 0,
    timestamp: Date.now(),
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const animationFrameRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const renderStartRef = useRef<number>(0)

  const measureFPS = useCallback(() => {
    if (!enabled) return

    const now = performance.now()
    frameCountRef.current++

    const elapsed = now - lastTimeRef.current
    if (elapsed >= sampleInterval) {
      const fps = Math.round((frameCountRef.current * 1000) / elapsed)
      frameCountRef.current = 0
      lastTimeRef.current = now

      setMetrics(prev => ({
        ...prev,
        fps,
        timestamp: Date.now(),
      }))
    }

    animationFrameRef.current = requestAnimationFrame(measureFPS)
  }, [enabled, sampleInterval])

  const measureMemory = useCallback(() => {
    if (!enabled || !('memory' in performance)) return

    const memory = (performance as any).memory
    const usedMB = memory.usedJSHeapSize / 1048576

    setMetrics(prev => ({
      ...prev,
      memory: Math.round(usedMB * 100) / 100,
    }))
  }, [enabled])

  const startRenderMeasure = useCallback(() => {
    renderStartRef.current = performance.now()
  }, [])

  const endRenderMeasure = useCallback(() => {
    if (renderStartRef.current === 0) return

    const renderTime = performance.now() - renderStartRef.current
    setMetrics(prev => ({
      ...prev,
      renderTime: Math.round(renderTime * 100) / 100,
    }))
    renderStartRef.current = 0
  }, [])

  const measureInteractionLatency = useCallback((callback: () => void) => {
    const start = performance.now()
    callback()
    requestAnimationFrame(() => {
      const latency = performance.now() - start
      setMetrics(prev => ({
        ...prev,
        interactionLatency: Math.round(latency * 100) / 100,
      }))
    })
  }, [])

  useEffect(() => {
    if (!enabled) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      return
    }

    // Start FPS measurement
    measureFPS()

    // Start memory measurement
    measureMemory()
    intervalRef.current = setInterval(measureMemory, sampleInterval)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, measureFPS, measureMemory, sampleInterval])

  return {
    metrics,
    startRenderMeasure,
    endRenderMeasure,
    measureInteractionLatency,
  }
}

