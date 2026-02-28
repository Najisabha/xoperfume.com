import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { Category } from "@/lib/models/category"
import { checkAuth } from "@/lib/auth-check"

// GET /api/categories - Get all categories
export async function GET() {
  try {
    await connectDB()

    // Get only main categories (those without parents)
    const categories = await Category.find({ parentId: null })
      .populate({
        path: 'subcategories',
        select: 'name name_ar name_he slug description _id'
      })
      .sort({ name: 1 })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error in GET /api/categories:', error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category (admin only)
export async function POST(req: Request) {
  try {
    const authError = await checkAuth("admin")
    if (authError) return authError

    await connectDB()
    const data = await req.json()

    const category = await Category.create({
      ...data,
      // Ensure parentId is null if it's "none"
      parentId: data.parentId === "none" ? null : data.parentId
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/categories:', error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}