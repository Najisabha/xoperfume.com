
import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { User } from "@/lib/models/user"
import { checkAuth } from "@/lib/auth-check"

export async function GET() {
  try {
    const authError = await checkAuth("admin")
    if (authError) return authError

    await connectDB()
    const users = await User.find({}, {
      password: 0, // Exclude password from response
      addresses: 0  // Exclude addresses for privacy
    }).sort({ createdAt: -1 })
    
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}