import { ProductDetails } from "./product-details"
import { getProductBySlug } from "@/lib/products"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const param = await params
  const product = await getProductBySlug(param.slug)

  if (!product) {
    return {
      title: 'Product Not Found - XO Perfumes',
      description: 'The product you are looking for does not exist.',
    }
  }

  const title = `${product.name} - XO Perfumes`
  const description = product.variants[0].description || 'Discover this beautiful piece of luxury jewelry for kids at XO Perfumes.'
  // const url = `https://www.graceleonard.com/products/${product.slug}`
  // const imageUrl = product.image || 'https://www.graceleonard.com/default-product-image.jpg'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      // url,
      // images: [
      //   {
      //     url: imageUrl,
      //     width: 800,
      //     height: 600,
      //     alt: product.name,
      //   },
      // ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      // images: [imageUrl],
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const param = await params
  const p = await getProductBySlug(param.slug)

  return <ProductDetails product={p} />
}
