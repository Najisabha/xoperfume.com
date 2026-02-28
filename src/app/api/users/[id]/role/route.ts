
import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { User } from "@/lib/models/user"
import { checkAuth } from "@/lib/auth-check"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await checkAuth("admin")
    if (authError) return authError

    const { role } = await req.json()
    
    await connectDB()
    const user = await User.findByIdAndUpdate(
      params.id,
      { role },
      { new: true }
    ).select('-password -addresses')

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    )
  }
}