'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { DataPoint } from '@/lib/types'
import { generateDataStream, generateTimeSeriesData } from '@/lib/dataGenerator'

interface UseDataStreamOptions {
  intervalMs?: number
  maxPoints?: number
  enabled?: boolean
  initialCount?: number
  baseValue?: number
  variance?: number
}

export function useDataStream(options: UseDataStreamOptions = {}) {
  const { intervalMs = 100, maxPoints = 1000, enabled = true, initialCount = 100, baseValue = 60, variance = 5 } = options
  const [data, setData] = useState<DataPoint[]>(() => {
    // Generate initial data so charts aren't empty
    return generateTimeSeriesData(initialCount, Date.now() - initialCount * intervalMs, baseValue, variance)
  })
  const [isStreaming, setIsStreaming] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<Generator<DataPoint, void, unknown> | null>(null)
  const isStreamingRef = useRef(false)

  const stopStream = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    isStreamingRef.current = false
    setIsStreaming(false)
  }, [])

  useEffect(() => {
    if (!enabled) {
      stopStream()
      return
    }

    // Prevent multiple starts
    if (isStreamingRef.current) {
      return
    }

    isStreamingRef.current = true
    setIsStreaming(true)
    streamRef.current = generateDataStream(intervalMs, maxPoints, baseValue, variance)

    intervalRef.current = setInterval(() => {
      const generator = streamRef.current
      if (!generator) return

      const result = generator.next()
      if (!result.done && result.value) {
        setData(prev => {
          const newData = [...prev, result.value]
          // Keep only the last maxPoints
          return newData.slice(-maxPoints)
        })
      } else {
        // Stream exhausted, restart
        streamRef.current = generateDataStream(intervalMs, maxPoints, baseValue, variance)
      }
    }, intervalMs)

    return () => {
      stopStream()
    }
  }, [enabled, intervalMs, maxPoints, baseValue, variance, stopStream])

  const clearData = useCallback(() => {
    setData([])
  }, [])

  return {
    data,
    isStreaming,
    stopStream,
    clearData,
  }
}

