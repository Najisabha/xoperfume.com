"use client"

import { useState, useEffect } from "react"
import { useFilter } from "@/contexts/filter-context"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchFilter({ dict }: { dict?: any }) {
  const { filters, setSearchQuery } = useFilter()
  const [localQuery, setLocalQuery] = useState(filters.searchQuery)
  const [isSearching, setIsSearching] = useState(false)

  // Use debounced value
  const debouncedQuery = useDebounce(localQuery, 300)

  useEffect(() => {
    if (debouncedQuery !== filters.searchQuery) {
      setIsSearching(true)
      setSearchQuery(debouncedQuery)
      setIsSearching(false)
    }
  }, [debouncedQuery, setSearchQuery, filters.searchQuery])

  return (
    <div className="relative">
      {isSearching ? (
        <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      ) : (
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        placeholder={dict?.search_placeholder || "Search products..."}
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="pl-9"
        disabled={isSearching}
      />
    </div>
  )
}