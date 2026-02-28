import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/filters/category-filter"
import { PriceFilter } from "@/components/filters/price-filter"
import { SortSelector } from "@/components/filters/sort-selector"
import { SearchFilter } from "@/components/filters/search-filter"
import { getDictionary } from "@/lib/get-dictionary"
import { Locale } from "@/lib/i18n-config"
import { FilterProvider } from "@/contexts/filter-context"

interface CategoryPageProps {
  params: Promise<{
    slug: string;
    lang: Locale;
  }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { lang, slug } = await params
  const dict = await getDictionary(lang)
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)
  const title = `${categoryName} - ${dict.shop.metadata_title || 'XO Perfumes'}`
  const description = dict.shop.metadata_description || `Explore our collection of ${slug}.`
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/shop/${slug}`

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
      site: '@xoperfumes',
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { lang, slug } = await params
  const dict = await getDictionary(lang)
  const isRtl = lang === 'ar' || lang === 'he'

  // Decoude URL encoded slug if necessary
  const decodedSlug = decodeURIComponent(slug)

  return (
    <FilterProvider initialFilters={{ categories: [decodedSlug] }}>
      <div className="container mx-auto px-4 py-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <h1 className="mb-8 text-3xl font-bold">{dict.shop.title}</h1>

        <div className="mb-8 flex items-center justify-between">
          <SearchFilter dict={dict.shop} />
          <SortSelector dict={dict.shop} />
        </div>

        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <aside className="space-y-8">
            <CategoryFilter dict={dict.shop} lang={lang} />
            <PriceFilter dict={dict.shop} />
          </aside>

          <main>
            <ProductGrid lang={lang} dict={dict.shop} />
          </main>
        </div>
      </div>
    </FilterProvider>
  )
}
