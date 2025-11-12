import type { DataPoint, AggregationPeriod, AggregatedData } from './types'

let worker: Worker | null = null

function getWorker(): Worker {
  if (typeof window === 'undefined') {
    throw new Error('Worker can only be used in browser environment')
  }
  if (!worker) {
    worker = new Worker('/worker.js')
  }
  return worker
}

export function aggregateDataInWorker(
  points: DataPoint[],
  period: AggregationPeriod
): Promise<AggregatedData[]> {
  return new Promise((resolve, reject) => {
    const w = getWorker()
    
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'AGGREGATE_RESULT') {
        w.removeEventListener('message', handleMessage)
        resolve(e.data.data)
      } else if (e.data.type === 'ERROR') {
        w.removeEventListener('message', handleMessage)
        reject(new Error(e.data.error))
      }
    }

    w.addEventListener('message', handleMessage)
    w.postMessage({
      type: 'AGGREGATE',
      data: { points, period },
    })
  })
}

export function normalizeDataInWorker(
  points: DataPoint[]
): Promise<DataPoint[]> {
  return new Promise((resolve, reject) => {
    const w = getWorker()
    
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'NORMALIZE_RESULT') {
        w.removeEventListener('message', handleMessage)
        resolve(e.data.data)
      } else if (e.data.type === 'ERROR') {
        w.removeEventListener('message', handleMessage)
        reject(new Error(e.data.error))
      }
    }

    w.addEventListener('message', handleMessage)
    w.postMessage({
      type: 'NORMALIZE',
      data: { points },
    })
  })
}

export function terminateWorker() {
  if (worker) {
    worker.terminate()
    worker = null
  }
}

