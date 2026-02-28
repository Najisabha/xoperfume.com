"use client"

import { useFilter } from "@/contexts/filter-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SortSelector({ dict }: { dict?: any }) {
  const { filters, setSortBy } = useFilter()

  const SORT_OPTIONS = [
    { value: "price-asc", label: dict?.sort_price_asc || "Price: Low to High" },
    { value: "price-desc", label: dict?.sort_price_desc || "Price: High to Low" },
    { value: "name-asc", label: dict?.sort_name_asc || "Name: A to Z" },
    { value: "name-desc", label: dict?.sort_name_desc || "Name: Z to A" },
  ] as const

  type SortValue = typeof SORT_OPTIONS[number]["value"]

  return (
    <Select
      value={filters.sortBy}
      onValueChange={(value: SortValue) => setSortBy(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={dict?.sort_by || "Sort by"} />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 