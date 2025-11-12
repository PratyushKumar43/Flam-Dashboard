'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface FilterPanelProps {
  onFilterChange?: (filters: FilterState) => void
}

export interface FilterState {
  minValue: number | null
  maxValue: number | null
  category: string
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    minValue: null,
    maxValue: null,
    category: '',
  })

  const handleChange = (field: keyof FilterState, value: string | number) => {
    const newFilters = {
      ...filters,
      [field]: value === '' ? null : value,
    }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      minValue: null,
      maxValue: null,
      category: '',
    }
    setFilters(resetFilters)
    onFilterChange?.(resetFilters)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Filter data by value range and category</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="minValue">Min Value</Label>
          <Input
            id="minValue"
            type="number"
            placeholder="Minimum"
            value={filters.minValue ?? ''}
            onChange={(e) => handleChange('minValue', e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxValue">Max Value</Label>
          <Input
            id="maxValue"
            type="number"
            placeholder="Maximum"
            value={filters.maxValue ?? ''}
            onChange={(e) => handleChange('maxValue', e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            type="text"
            placeholder="Category filter"
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
          />
        </div>
        <Button onClick={handleReset} variant="outline" className="w-full text-foreground">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  )
}

