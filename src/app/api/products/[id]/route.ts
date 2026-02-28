import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { Product } from "@/lib/models/product"
import { checkAuth } from "@/lib/auth-check"
import { Category } from "@/lib/models/category"

interface RouteParams {
  params: {
    id: string
  }
}

// Helper function to clean document for update
function cleanDocumentForUpdate(data: any) {
  const cleaned = { ...data }
  delete cleaned._id
  
  // Clean variant IDs if variants exist
  if (cleaned.variants) {
    cleaned.variants = cleaned.variants.map((variant: any) => {
      const cleanedVariant = { ...variant }
      delete cleanedVariant._id
      return cleanedVariant
    })
  }
  
  return cleaned
}

export async function GET(req: Request, { params }: RouteParams) {
  const param = await params
  try {
    await connectDB()
    await Category.find({})
    const product = await Product.findById(param.id).populate('category')
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

export async function PATCH(req: Request, { params }: RouteParams) {
  const param = await params
  try {
    const authError = await checkAuth("admin")
    if (authError) return authError

    await connectDB()
    const rawData = await req.json()
    
    // Clean the data before update
    const cleanedData = cleanDocumentForUpdate(rawData)
    
    await Category.find({})
    const product = await Product.findByIdAndUpdate(
      param.id,
      { $set: cleanedData },
      { new: true }
    ).populate('category')

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
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete a product (admin only)
export async function DELETE(req: Request, { params }: RouteParams) {
  const param = await params
  try {
    const authError = await checkAuth("admin")
    if (authError) return authError

    await connectDB()
    const product = await Product.findByIdAndDelete(param.id)

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}