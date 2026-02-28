import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { Category } from "@/lib/models/category"
import { checkAuth } from "@/lib/auth-check"

// GET /api/categories/[categoryId] - Get a single category
export async function GET(
  req: Request,
  context: { params: Promise<{ categoryId: string }> }
) {
  const { categoryId } = await context.params
  try {
    await connectDB()
    const category = await Category.findById(categoryId)
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[categoryId] - Update a category (admin only)
export async function PUT(
  req: Request,
  context: { params: Promise<{ categoryId: string }> }
) {
  const { categoryId } = await context.params
  try {
    const authError = await checkAuth("admin")
    if (authError) return authError

    await connectDB()
    const data = await req.json()
    const category = await Category.findByIdAndUpdate(
      categoryId,
      data,
      { new: true }
    )
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error in PUT /api/categories/[categoryId]:', error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[categoryId] - Delete a category (admin only)
export async function DELETE(
  req: Request,
  context: { params: Promise<{ categoryId: string }> }
) {
  const { categoryId } = await context.params
  try {
    const authError = await checkAuth("admin")
    if (authError) return authError

    await connectDB()
    const category = await Category.findByIdAndDelete(categoryId)
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }
    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" + error },
      { status: 500 }
    )
  }
}