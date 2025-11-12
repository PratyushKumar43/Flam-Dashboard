'use client'

import { useEffect, useRef, useState } from 'react'

export default function FPSCounter() {
  const last = useRef<number>(performance.now())
  const frames = useRef<number>(0)
  const [fps, setFps] = useState(0)

  useEffect(() => {
    let raf = 0
    const loop = (t: number) => {
      frames.current++
      if (t - last.current >= 1000) {
        setFps(frames.current)
        frames.current = 0
        last.current = t
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        right: 8,
        top: 8,
        background: '#000',
        color: fps >= 60 ? '#0f0' : fps >= 30 ? '#ff0' : '#f00',
        padding: '6px 12px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: 9999,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      FPS: {fps}
    </div>
  )
}

