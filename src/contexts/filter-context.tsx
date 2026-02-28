"use client"

import { createContext, useContext, useState, useCallback } from "react"

type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc"

interface FilterState {
  categories: string[]
  priceRange: [number, number]
  sortBy: SortOption
  searchQuery: string
}

interface FilterContextType {
  filters: FilterState
  setCategories: (categories: string[]) => void
  setPriceRange: (range: [number, number]) => void
  setSortBy: (sort: SortOption) => void
  setSearchQuery: (query: string) => void
  clearFilters: () => void
}

const initialState: FilterState = {
  categories: [],
  priceRange: [0, 10000],
  sortBy: "name-asc",
  searchQuery: "",
}

const FilterContext = createContext<FilterContextType | null>(null)

interface FilterProviderProps {
  children: React.ReactNode
  initialFilters?: Partial<FilterState>
}

export function FilterProvider({ children, initialFilters }: FilterProviderProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...initialState,
    ...initialFilters,
  })

  const setCategories = useCallback((categories: string[]) => {
    setFilters(prev => ({ ...prev, categories }))
  }, [])

  const setPriceRange = useCallback((priceRange: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange }))
  }, [])

  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy }))
  }, [])

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(initialState)
  }, [])

  return (
    <FilterContext.Provider
      value={{
        filters,
        setCategories,
        setPriceRange,
        setSortBy,
        setSearchQuery,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}