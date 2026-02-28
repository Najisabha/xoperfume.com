import { ProductDetails } from "./product-details"
import { getProductBySlug } from "@/lib/products"
import { getDictionary } from "@/lib/get-dictionary"
import { Locale } from "@/lib/i18n-config"

interface PageProps {
  params: Promise<{
    lang: Locale
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps) {
  const param = await params
  const product = await getProductBySlug(param.slug)

  if (!product) {
    return {
      title: 'Product Not Found - XO Perfumes',
      description: 'The product you are looking for does not exist.',
    }
  }

  const lang = param.lang
  const name =
    lang === 'ar' && product.name_ar ? product.name_ar :
      lang === 'he' && product.name_he ? product.name_he :
        product.name

  const firstVariant = product.variants[0]
  const desc =
    lang === 'ar' && firstVariant?.description_ar ? firstVariant.description_ar :
      lang === 'he' && firstVariant?.description_he ? firstVariant.description_he :
        firstVariant?.description || 'Discover this beautiful luxury fragrance at XO Perfumes.'

  const title = `${name} - XO Perfumes`

  return {
    title,
    description: desc,
    openGraph: { title, description: desc },
    twitter: { card: 'summary_large_image', title, description: desc },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const param = await params
  const [product, dict] = await Promise.all([
    getProductBySlug(param.slug),
    getDictionary(param.lang),
  ])

  // Fetch related products (same category, excluding current)
  let relatedProducts: any[] = []
  if (product?.category?._id) {
    try {
      const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : (process.env.NEXT_PUBLIC_SITE_URL || '')
      const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-cache' })
      if (res.ok) {
        const all = await res.json()
        relatedProducts = (all as any[])
          .filter((p: any) =>
            p.category?._id?.toString() === product.category._id &&
            p.slug !== product.slug
          )
          .slice(0, 5)
      }
    } catch {
      // silently ignore – related products are non-critical
    }
  }

  return (
    <ProductDetails
      product={product}
      lang={param.lang}
      dict={dict}
      relatedProducts={relatedProducts}
    />
  )
}
