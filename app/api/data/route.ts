import { NextResponse } from 'next/server'
import { generateMultiSeriesData } from '@/lib/dataGenerator'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const count = parseInt(searchParams.get('count') || '1000')
  const startTime = parseInt(searchParams.get('startTime') || String(Date.now() - 3600000))

  const data = generateMultiSeriesData(count, startTime)

  return NextResponse.json({
    fps: data.fps,
    memory: data.memory,
    latency: data.latency,
    timestamp: Date.now(),
  })
}

