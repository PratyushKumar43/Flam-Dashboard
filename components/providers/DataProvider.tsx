'use client'

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { DataPoint, AggregationPeriod } from '@/lib/types'
import { generateMultiSeriesData, aggregateData } from '@/lib/dataGenerator'

interface DataContextValue {
  fpsData: DataPoint[]
  memoryData: DataPoint[]
  latencyData: DataPoint[]
  aggregatedData: {
    fps: ReturnType<typeof aggregateData>
    memory: ReturnType<typeof aggregateData>
    latency: ReturnType<typeof aggregateData>
  }
  aggregationPeriod: AggregationPeriod
  setAggregationPeriod: (period: AggregationPeriod) => void
  updateData: (newData: {
    fps?: DataPoint[]
    memory?: DataPoint[]
    latency?: DataPoint[]
  }) => void
  clearData: () => void
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

interface DataProviderProps {
  children: React.ReactNode
  initialData?: {
    fps?: DataPoint[]
    memory?: DataPoint[]
    latency?: DataPoint[]
  }
}

export function DataProvider({ children, initialData }: DataProviderProps) {
  const [fpsData, setFpsData] = useState<DataPoint[]>(initialData?.fps || [])
  const [memoryData, setMemoryData] = useState<DataPoint[]>(initialData?.memory || [])
  const [latencyData, setLatencyData] = useState<DataPoint[]>(initialData?.latency || [])
  const [aggregationPeriod, setAggregationPeriod] = useState<AggregationPeriod>('1min')

  const updateData = useCallback((newData: {
    fps?: DataPoint[]
    memory?: DataPoint[]
    latency?: DataPoint[]
  }) => {
    if (newData.fps) setFpsData(newData.fps)
    if (newData.memory) setMemoryData(newData.memory)
    if (newData.latency) setLatencyData(newData.latency)
  }, [])

  const clearData = useCallback(() => {
    setFpsData([])
    setMemoryData([])
    setLatencyData([])
  }, [])

  const aggregatedData = useMemo(() => ({
    fps: aggregateData(fpsData, aggregationPeriod),
    memory: aggregateData(memoryData, aggregationPeriod),
    latency: aggregateData(latencyData, aggregationPeriod),
  }), [fpsData, memoryData, latencyData, aggregationPeriod])

  const value = useMemo(() => ({
    fpsData,
    memoryData,
    latencyData,
    aggregatedData,
    aggregationPeriod,
    setAggregationPeriod,
    updateData,
    clearData,
  }), [
    fpsData,
    memoryData,
    latencyData,
    aggregatedData,
    aggregationPeriod,
    updateData,
    clearData,
  ])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

