import { Product } from "@/types"

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/products/by-slug/${slug}`
    const response = await fetch(URL, {
      cache: 'no-cache',
    })

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Network response was not ok')
    }

    const product = await response.json()
    
    return {
      _id: product._id.toString(),
      name: product.name,
      basePrice: product.basePrice,
      image: product.variants[0]?.images[0] || '',
      slug: product.slug,
      category: {
        _id: product.category._id.toString(),
        name: product.category.name,
        slug: product.category.slug,
        isSubcategory: product.category.isSubcategory
      },
      variants: product.variants.map((variant: any) => ({
        _id: variant._id.toString(),
        sku: variant.sku,
        description: variant.description,
        color: variant.color,
        size: variant.size,
        caratSize: variant.caratSize,
        price: variant.price,
        stock: variant.stock,
        images: variant.images,
        stockStatus: variant.stockStatus
      })),
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt)
    }
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return null
  }
}