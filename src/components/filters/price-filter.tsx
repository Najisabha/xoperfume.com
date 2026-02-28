"use client"

import { useState, useEffect } from "react"
import { useFilter } from "@/contexts/filter-context"
import { Slider } from "@/components/ui/slider"
import { formatPrice } from "@/lib/utils"

export function PriceFilter({ dict }: { dict?: any }) {
  const { filters, setPriceRange } = useFilter()
  const [localRange, setLocalRange] = useState(filters.priceRange)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPriceRange(localRange)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [localRange, setPriceRange])

  const handleValueChange = (value: number[]) => {
    setLocalRange([value[0], value[1]] as [number, number])
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">{dict?.price_range || "Price Range"}</h2>
      <Slider
        min={200}
        max={10000}
        step={10}
        value={localRange}
        onValueChange={handleValueChange}
        className="w-full"
      />
      <div className="flex justify-between text-sm">
        <span>{formatPrice(localRange[0])}</span>
        <span>{formatPrice(localRange[1])}</span>
      </div>
    </div>
  )
} 