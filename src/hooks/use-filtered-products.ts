"use client"

import { useEffect, useMemo, useState } from "react"
import { useFilter } from "@/contexts/filter-context"
import { Product } from "@/types"


export function useFilteredProducts() {
  const { filters } = useFilter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format')
        }
        
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters with loading state
  const filteredProducts = useMemo(() => {
    try {
      let result = [...products]

      // Apply category filter using slugs
      if (filters.categories.length > 0) {
        result = result.filter(product => 
          filters.categories.includes(product?.category?.slug)
        )
      }

      // Apply price filter
      result = result.filter(product => 
        product.variants[0]?.price >= filters?.priceRange[0] && 
        product.variants[0]?.price <= filters?.priceRange[1]
      )

      // Apply search filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase()
        result = result.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) 
          // product?.category?.toLowerCase()?.includes(searchLower)
        )
      }

      // Apply sorting
      switch (filters.sortBy) {
        case "price-asc":
          result.sort((a, b) => a.variants[0]?.price - b.variants[0]?.price)
          break
        case "price-desc":
          result.sort((a, b) => b.variants[0]?.price - a.variants[0]?.price)
          break
        case "name-asc":
          result.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "name-desc":
          result.sort((a, b) => b.name.localeCompare(a.name))
          break
      }

      return result
    } catch (err) {
      console.error('Filtering error:', err)
      return products
    }
  }, [products, filters])

  return {
    products: filteredProducts,
    isLoading,
    error,
    totalProducts: products.length,
    filteredCount: filteredProducts.length,
  }
}