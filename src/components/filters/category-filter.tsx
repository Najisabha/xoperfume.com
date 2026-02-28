"use client"

import { useEffect, useState } from "react"
import { useFilter } from "@/contexts/filter-context"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"

interface Category {
  _id: string
  name: string
  slug: string
}

export function CategoryFilter({ dict, lang }: { dict?: any, lang: string }) {
  const { filters, setCategories } = useFilter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setAvailableCategories] = useState<Category[]>([])

  const fetchCategoriesWithRetry = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setAvailableCategories(data)
        return
      } catch (err) {
        if (i === retries - 1) {
          setError('Failed to load categories')
          console.error('Failed to fetch categories after retries:', err)
          return
        }
        // Wait with exponential backoff before retrying
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }

  useEffect(() => {
    fetchCategoriesWithRetry()
  }, [])

  const handleCategoryChange = async (categorySlug: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const updatedCategories = filters.categories.includes(categorySlug)
        ? filters.categories.filter((slug) => slug !== categorySlug)
        : [...filters.categories, categorySlug]

      await setCategories(updatedCategories)
    } catch (err) {
      setError('Failed to update category filter')
      console.error('Category filter error:', err)
      // Reset to previous state
      setCategories(filters.categories)
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">{dict?.categories || "Categories"}</h2>
      {isLoading && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">{dict?.updating || "Updating..."}</span>
        </div>
      )}
      <div className="space-y-3">
        {categories.map((category: any) => (
          <div key={category._id} className="flex items-center space-x-2">
            <Checkbox
              id={category.slug}
              checked={filters.categories.includes(category.slug)}
              onCheckedChange={() => handleCategoryChange(category.slug)}
            />
            <Label htmlFor={category.slug}>
              {lang === 'ar' ? category.name_ar : lang === 'he' ? category.name_he : category.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}