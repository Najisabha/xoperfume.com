import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/filters/category-filter"
import { PriceFilter } from "@/components/filters/price-filter"
import { SortSelector } from "@/components/filters/sort-selector"
import { SearchFilter } from "@/components/filters/search-filter"
import { FilterProvider } from "@/contexts/filter-context"

interface CategoryPageProps {
  params: {
    slug: string;
    lang: string;
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const param = await params;
  const lang = param.lang
  const categoryName = param.slug.charAt(0).toUpperCase() + param.slug.slice(1)
  const title = `${categoryName} - XO Perfumes Jewelry Collection`
  const description = `Explore our luxurious collection of children's ${param.slug}. Handcrafted with love and care for your little ones.`
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/shop/${param.slug}`
  const imageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.png`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'XO Perfumes',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `XO Perfumes ${categoryName}`,
        },
      ],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      site: '@graceleonard',
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const param = await params;
  return (
    <FilterProvider initialFilters={{ categories: [param.slug] }}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Collection</h1>

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
    </FilterProvider>
  )
}
