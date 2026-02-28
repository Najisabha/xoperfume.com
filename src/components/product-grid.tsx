"use client"

import { useFilteredProducts } from "@/hooks/use-filtered-products"
import { ProductCard } from "@/components/product-card"
import { useFilter } from "@/contexts/filter-context"
import { Fragment } from "react"
import { AlertCircle, Loader2 } from "lucide-react"

export function ProductGrid() {
  const { products, isLoading, filteredCount, totalProducts } = useFilteredProducts()
  const { filters } = useFilter()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
          <p className="text-sm text-primary">Loading products...</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[240px] animate-pulse rounded-lg bg-primary/60"
            />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center">
        <p className="text-lg text-muted-foreground">
          {filters.searchQuery
            ? `No products found matching "${filters.searchQuery}"`
            : "No products found with the selected filters"}
        </p>
        {filteredCount !== totalProducts && (
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredCount} of {totalProducts} products
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Fragment key={product._id}>
            <ProductCard
              product={product}
            />
          </Fragment>
        ))}
      </div>
    </>
  )
}