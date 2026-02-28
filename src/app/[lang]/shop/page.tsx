import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/filters/category-filter"
import { PriceFilter } from "@/components/filters/price-filter"
import { SortSelector } from "@/components/filters/sort-selector"
import { SearchFilter } from "@/components/filters/search-filter"

export async function generateMetadata() {
  const title = 'Collections - XO Perfumes'
  const description = 'Explore the collections of luxury jewelry for kids by XO Perfumes.'
  const url = 'https://www.graceleonard.com/categories'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'XO Perfumes',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
      site: '@graceleonard',
    },
  }
}

export default async function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Collections</h1>

      <div className="mb-8 flex items-center justify-between">
        <SearchFilter />
        <SortSelector />
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className="space-y-8">
          <CategoryFilter />
          <PriceFilter />
        </aside>

        <main>
          <ProductGrid />
        </main>
      </div>
    </div>
  )
}