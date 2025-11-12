'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AggregationPeriod } from '@/lib/types'

interface TimeRangeSelectorProps {
  aggregationPeriod: AggregationPeriod
  onPeriodChange: (period: AggregationPeriod) => void
}

export function TimeRangeSelector({
  aggregationPeriod,
  onPeriodChange,
}: TimeRangeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Range</CardTitle>
        <CardDescription>Select aggregation period for data grouping</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={aggregationPeriod} onValueChange={(value) => onPeriodChange(value as AggregationPeriod)}>
          <SelectTrigger>
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1min">1 Minute</SelectItem>
            <SelectItem value="5min">5 Minutes</SelectItem>
            <SelectItem value="1hour">1 Hour</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

