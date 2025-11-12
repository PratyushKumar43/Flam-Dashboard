'use client'

import { useEffect, useState, Suspense, lazy, memo, useTransition } from 'react'
import { DataProvider, useData } from '@/components/providers/DataProvider'
import { useDataStream } from '@/hooks/useDataStream'
import { FilterPanel } from '@/components/controls/FilterPanel'
import { TimeRangeSelector } from '@/components/controls/TimeRangeSelector'
// Lazy load performance monitoring components - defer to reduce initial load
const PerformanceMonitor = lazy(() => import('@/components/ui/PerformanceMonitor').then(m => ({ default: m.PerformanceMonitor })))
const PerformanceStats = lazy(() => import('@/components/ui/PerformanceStats').then(m => ({ default: m.PerformanceStats })))
const FPSCounter = lazy(() => import('@/components/ui/FPSCounter').then(m => ({ default: m.default })))
import { SectionCards } from '@/components/section-cards'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { DataPoint } from '@/lib/types'
import data from '@/app/dashboard/data.json'

// Lazy load chart components - only load when needed
const LineChart = lazy(() => import('@/components/charts/LineChart').then(m => ({ default: m.LineChart })))
const BarChart = lazy(() => import('@/components/charts/BarChart').then(m => ({ default: m.BarChart })))
const ScatterPlot = lazy(() => import('@/components/charts/ScatterPlot').then(m => ({ default: m.ScatterPlot })))
const Heatmap = lazy(() => import('@/components/charts/Heatmap').then(m => ({ default: m.Heatmap })))
const DataTable = lazy(() => import('@/components/data-table').then(m => ({ default: m.DataTable })))

// Loading fallback for charts
const ChartLoader = () => (
  <div className="flex items-center justify-center h-[400px]">
    <div className="text-muted-foreground">Loading chart...</div>
  </div>
)

function DashboardContentInner() {
  const { fpsData, memoryData, latencyData, aggregationPeriod, setAggregationPeriod, updateData } = useData()
  const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'scatter' | 'heatmap'>('line')
  const [filters, setFilters] = useState<{ minValue: number | null; maxValue: number | null; category: string }>({
    minValue: null,
    maxValue: null,
    category: '',
  })
  const [isPending, startTransition] = useTransition()

  // Real-time data streams with initial data
  // Each stream uses different base values to show distinct patterns
  // Assignment requires: 100ms intervals, 10,000+ points
  const fpsStream = useDataStream({ intervalMs: 100, maxPoints: 10000, enabled: true, initialCount: 100, baseValue: 60, variance: 3 })
  const memoryStream = useDataStream({ intervalMs: 100, maxPoints: 10000, enabled: true, initialCount: 100, baseValue: 0.6, variance: 0.1 })
  const latencyStream = useDataStream({ intervalMs: 100, maxPoints: 10000, enabled: true, initialCount: 100, baseValue: 85, variance: 10 })

  // Update context with stream data - use useTransition for non-blocking updates
  useEffect(() => {
    // Use startTransition to mark updates as non-urgent, preventing blocking
    startTransition(() => {
      updateData({
        fps: fpsStream.data,
        memory: memoryStream.data,
        latency: latencyStream.data,
      })
    })
  }, [fpsStream.data, memoryStream.data, latencyStream.data, updateData, startTransition])

  // Filter data based on filters
  const filterData = (data: DataPoint[]): DataPoint[] => {
    return data.filter(point => {
      if (filters.minValue !== null && point.value < filters.minValue) return false
      if (filters.maxValue !== null && point.value > filters.maxValue) return false
      if (filters.category && point.category && point.category !== filters.category) return false
      return true
    })
  }

  const chartData = selectedChart === 'line' ? filterData(fpsData) :
                    selectedChart === 'bar' ? filterData(memoryData) :
                    selectedChart === 'scatter' ? filterData(latencyData) :
                    filterData(fpsData)

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <Suspense fallback={null}>
        <FPSCounter />
      </Suspense>
      <SectionCards />
      
      <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Performance Charts</CardTitle>
              <CardDescription>Real-time data visualization with Canvas + SVG</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedChart} onValueChange={(v) => {
                startTransition(() => {
                  setSelectedChart(v as any)
                })
              }}>
                <TabsList>
                  <TabsTrigger value="line">Line</TabsTrigger>
                  <TabsTrigger value="bar">Bar</TabsTrigger>
                  <TabsTrigger value="scatter">Scatter</TabsTrigger>
                  <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                </TabsList>
                <TabsContent value="line" className="mt-4">
                  <div className="w-full overflow-auto">
                    <Suspense fallback={<ChartLoader />}>
                      <LineChart data={chartData} width={800} height={400} />
                    </Suspense>
                  </div>
                </TabsContent>
                <TabsContent value="bar" className="mt-4">
                  <div className="w-full overflow-auto">
                    <Suspense fallback={<ChartLoader />}>
                      <BarChart data={chartData} width={800} height={400} />
                    </Suspense>
                  </div>
                </TabsContent>
                <TabsContent value="scatter" className="mt-4">
                  <div className="w-full overflow-auto">
                    <Suspense fallback={<ChartLoader />}>
                      <ScatterPlot data={chartData} width={800} height={400} />
                    </Suspense>
                  </div>
                </TabsContent>
                <TabsContent value="heatmap" className="mt-4">
                  <div className="w-full overflow-auto">
                    <Suspense fallback={<ChartLoader />}>
                      <Heatmap data={chartData} width={800} height={400} />
                    </Suspense>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded" />}>
            <PerformanceMonitor />
          </Suspense>
          <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded" />}>
            <PerformanceStats />
          </Suspense>
          <TimeRangeSelector
            aggregationPeriod={aggregationPeriod}
            onPeriodChange={setAggregationPeriod}
          />
          <FilterPanel onFilterChange={setFilters} />
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <Suspense fallback={<div className="flex items-center justify-center h-64">Loading table...</div>}>
          <DataTable data={data} />
        </Suspense>
      </div>
    </div>
  )
}

interface DashboardContentProps {
  initialData?: {
    fps?: DataPoint[]
    memory?: DataPoint[]
    latency?: DataPoint[]
  }
}

export function DashboardContent({ initialData }: DashboardContentProps) {
  return (
    <DataProvider initialData={initialData}>
      <DashboardContentInner />
    </DataProvider>
  )
}

