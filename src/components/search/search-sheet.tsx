"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Search, Loader2, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import debounce from "lodash/debounce"
import { cn } from "@/lib/utils"
import { Product } from "@/types"
import { SearchResponse } from "@/types/search"
import { useRouter } from "next/navigation"

export function SearchSheet({
  categories,
  products,
  lang,
  label
}: {
  categories: any[]
  products: any[]
  lang: string
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      setError("")

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data: SearchResponse = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to search products')
        }

        setResults(data.products || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    debouncedSearch(query)
    return () => debouncedSearch.cancel()
  }, [query, debouncedSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(prev =>
        prev < results.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      const selectedProduct = results[selectedIndex]
      if (selectedProduct) {
        setOpen(false)
        router.push(`/products/${selectedProduct.slug}`)
      }
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    inputRef.current?.focus()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Search className="h-5 w-5 md:hidden" />
          <span className="hidden sm:inline">{label || 'Search'}</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="w-full h-full sm:h-[85vh] pt-12 px-4 sm:px-8 bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <SheetHeader className="relative mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={label || "Search for products..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 pr-10 h-12 text-lg border-none bg-muted/50 rounded-full"
                autoFocus
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </SheetHeader>

          {/* Search Results */}
          {query && (
            <div className="mt-8 relative min-h-[200px]">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}

              {!loading && results.length === 0 && query.length >= 2 && (
                <div className="text-center py-12">
                  <img
                    src="/assets/drawings/ai18.svg"
                    alt="No results"
                    width={120}
                    height={120}
                    className="mx-auto opacity-50"
                  />
                  <p className="mt-4 text-muted-foreground">
                    {lang === 'ar' ? `لم يتم العثور على منتجات لـ "${query}"` : lang === 'he' ? `לא נמצאו מוצרים עבור "${query}"` : `No products found for "${query}"`}
                  </p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((product, index) => {
                    const productName = lang === 'ar' && product.name_ar ? product.name_ar : lang === 'he' && product.name_he ? product.name_he : product.name;
                    const categoryName = lang === 'ar' && product.category?.name_ar ? product.category.name_ar : lang === 'he' && product.category?.name_he ? product.category.name_he : product.category?.name;
                    return (
                      <Link
                        key={product._id}
                        href={`/${lang}/products/${product.slug}`}
                        className={cn(
                          "flex items-center p-3 rounded-lg transition-colors",
                          "hover:bg-accent",
                          selectedIndex === index && "bg-accent"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={product.image || '/placeholder.png'}
                            alt={productName}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="ml-4 rtl:mr-4 rtl:ml-0 flex-1">
                          <h3 className="font-medium line-clamp-1">{productName}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {categoryName}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Initial State Content */}
          {!query && (
            <div className="mt-4 space-y-12">
              {/* Categories section */}
              <div>
                <h3 className="text-lg font-medium mb-6">
                  {lang === 'ar' ? 'الفئات الشائعة' : lang === 'he' ? 'קטגוריות פופולריות' : 'Popular Categories'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {categories.slice(0, 6).map((category) => {
                    const catName = lang === 'ar' && category.name_ar ? category.name_ar : lang === 'he' && category.name_he ? category.name_he : category.name;
                    return (
                      <Link
                        key={category._id}
                        href={`/${lang}/shop/${category.slug}`}
                        className="px-4 py-2 rounded-full bg-accent hover:bg-accent/80 text-sm"
                        onClick={() => setOpen(false)}
                      >
                        {catName}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Popular Products section */}
              <div>
                <h3 className="text-lg font-medium mb-6">
                  {lang === 'ar' ? 'المنتجات الشائعة' : lang === 'he' ? 'מוצרים פופולריים' : 'Popular Products'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {products.slice(0, 4).map((product) => {
                    const prodName = lang === 'ar' && product.name_ar ? product.name_ar : lang === 'he' && product.name_he ? product.name_he : product.name;
                    const catName = lang === 'ar' && product.category?.name_ar ? product.category.name_ar : lang === 'he' && product.category?.name_he ? product.category.name_he : product.category?.name;
                    return (
                      <Link
                        key={product._id}
                        href={`/${lang}/products/${product.slug}`}
                        onClick={() => setOpen(false)}
                        className="group"
                      >
                        <div className="relative aspect-square mb-3">
                          <img
                            src={product.variants[0]?.images[0] || '/placeholder.png'}
                            alt={prodName}
                            className="object-cover rounded-lg group-hover:opacity-90 transition-opacity w-full h-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium text-sm line-clamp-1 group-hover:font-black">
                            {prodName}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {catName}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
