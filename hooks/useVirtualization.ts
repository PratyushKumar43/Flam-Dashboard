'use client'

import { useMemo, useState, useEffect, useRef } from 'react'

interface UseVirtualizationOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function useVirtualization<T>(
  items: T[],
  options: UseVirtualizationOptions
) {
  const { itemHeight, containerHeight, overscan = 3 } = options
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const endIndex = Math.min(
      items.length - 1,
      startIndex + visibleCount + overscan * 2
    )

    return {
      startIndex,
      endIndex,
      visibleItems: items.slice(startIndex, endIndex + 1),
    }
  }, [items, scrollTop, itemHeight, containerHeight, overscan])

  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScrollEvent = () => {
      setScrollTop(container.scrollTop)
    }

    container.addEventListener('scroll', handleScrollEvent)
    return () => container.removeEventListener('scroll', handleScrollEvent)
  }, [])

  return {
    visibleItems: visibleRange.visibleItems,
    startIndex: visibleRange.startIndex,
    endIndex: visibleRange.endIndex,
    totalHeight,
    offsetY,
    containerRef,
    handleScroll,
  }
}

