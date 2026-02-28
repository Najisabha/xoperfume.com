import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { checkAuth } from "@/lib/auth-check"
import connectDB from "@/lib/db"
import { User } from "@/lib/models/user"
import { profileSchema } from "@/lib/validations/profile"
import { authConfig } from "@/lib/auth.config"

export async function GET() {
  try {
    const authError = await checkAuth()
    if (authError) return authError

    const session = await getServerSession(authConfig)
    await connectDB()
    
    const user = await User.findById(session?.user.id).select("-password")
    if (!user) {
      console.log(`Could not find user with id: ${session?.user.id}`)
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("[PROFILE_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const authError = await checkAuth()
    if (authError) return authError

    const session = await getServerSession(authConfig)
    const body = await req.json()
    const validatedData = profileSchema.parse(body)

    await connectDB()
    const user = await User.findById(session?.user.id)

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const updatedUser = await User.findByIdAndUpdate(
      session?.user.id,
      { $set: validatedData },
      { new: true }
    ).select("-password")

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[PROFILE_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 