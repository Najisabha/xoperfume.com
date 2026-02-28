import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { Product } from "@/lib/models/product"
import { Category } from "@/lib/models/category" // Ensure this import

export async function GET() {
  try {
    await connectDB()
    await Category.find({})
    const products = await Product.find()
      .populate('category')
      .populate('variants.color')
      .exec()
    return NextResponse.json(products)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()

    const data = await req.json()

    // Validate required fields with specific messages
    if (!data.name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      )
    }
    if (!data.slug) {
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      )
    }
    if (!data.category) {
      return NextResponse.json(
        { error: "Product category is required" },
        { status: 400 }
      )
    }
    if (!data.variants?.length) {
      return NextResponse.json(
        { error: "At least one product variant is required" },
        { status: 400 }
      )
    }

    // Validate that the category exists
    const categoryExists = await Category.findById(data.category)
    if (!categoryExists) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      )
    }

    const product = await Product.create({
      name: data.name,
      basePrice: Number(data.basePrice),
      image: data.image,
      slug: data.slug,
      category: data.category,
      countries: data.countries || ['uae'],
      variants: data.variants.map((variant: any) => ({
        sku: variant.sku,
        color: variant.color || null,
        price: Number(variant.price),
        stock: Number(variant.stock),
        images: variant.images,
        stockStatus: variant.stockStatus,
        description: variant.description || '',
      }))
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("Product creation error:", error)

    // Handle mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return NextResponse.json(
        { error: `A product with this ${field} already exists` },
        { status: 409 }
      )
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to create product", details: errorMessage },
      { status: 500 }
    )
  }
}