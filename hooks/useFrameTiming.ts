'use client'

import { useEffect, useRef } from 'react'
import { logPerformance } from '@/lib/performanceLogger'

/**
 * Hook to measure frame timing and FPS
 */
export function useFrameTiming(enabled: boolean = true) {
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const lastFrameTimeRef = useRef(performance.now())

  useEffect(() => {
    if (!enabled) return

    let rafId: number

    const measureFrame = (currentTime: number) => {
      const frameTime = currentTime - lastFrameTimeRef.current
      lastFrameTimeRef.current = currentTime

      frameCountRef.current++

      // Log every second
      if (currentTime - lastTimeRef.current >= 1000) {
        const fps = frameCountRef.current
        logPerformance({
          fps,
          frameTime: frameTime,
          memory:
            typeof performance !== 'undefined' && 'memory' in performance
              ? (performance as any).memory
              : undefined,
        })

        frameCountRef.current = 0
        lastTimeRef.current = currentTime
      }

      rafId = requestAnimationFrame(measureFrame)
    }

    rafId = requestAnimationFrame(measureFrame)

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [enabled])
}

