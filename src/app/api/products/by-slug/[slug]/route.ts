import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { Product } from "@/lib/models/product"
import { Category } from "@/lib/models/category"

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const param = await params
  try {
    await connectDB()
    await Category.find({})
    console.log("param.slug", param.slug)
    const product = await Product.findOne({ slug: param.slug })
      .populate('category')
      .populate('variants.color')

    console.log("product", product)
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
