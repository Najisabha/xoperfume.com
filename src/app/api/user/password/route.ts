import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { checkAuth } from "@/lib/auth-check"
import { authConfig } from "@/lib/auth.config"
import connectDB from "@/lib/db"
import { User } from "@/lib/models/user"
import { passwordSchema } from "@/lib/validations/password"

export async function PATCH(req: Request) {
  try {
    const authError = await checkAuth()
    if (authError) return authError

    const session = await getServerSession(authConfig)
    const body = await req.json()
    const validatedData = passwordSchema.parse(body)

    await connectDB()
    const user = await User.findById(session?.user.id)

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Verify current password
    const isValid = await compare(validatedData.currentPassword, user.password)
    if (!isValid) {
      return new NextResponse("Current password is incorrect", { status: 400 })
    }

    // Update password
    await User.findByIdAndUpdate(session?.user.id, {
      $set: { password: validatedData.newPassword },
    })

    return new NextResponse("Password updated successfully", { status: 200 })
  } catch (error) {
    console.error("[PASSWORD_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 