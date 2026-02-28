import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { checkAuth } from "@/lib/auth-check"
import connectDB from "@/lib/db"
import { User } from "@/lib/models/user"
import { addressSchema } from "@/lib/validations/address"
import { authConfig } from "@/lib/auth.config"

export async function GET() {
  try {
    const authError = await checkAuth()
    if (authError) return authError

    const session = await getServerSession(authConfig)
    await connectDB()
    
    const user = await User.findById(session?.user.id).select("addresses")
    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json(user.addresses)
  } catch (error) {
    console.error("[ADDRESSES_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const authError = await checkAuth()
    if (authError) return authError

    const session = await getServerSession(authConfig)
    const body = await req.json()
    const validatedData = addressSchema.parse(body)

    await connectDB()
    const user = await User.findById(session?.user.id)

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // If this is the first address or marked as default, set as default
    if (user.addresses.length === 0 || validatedData?.isDefault) {
      await User.updateMany(
        { _id: session?.user.id },
        { $set: { "addresses.$[].isDefault": false } }
      )
    }

    const updatedUser = await User.findByIdAndUpdate(
      session?.user.id,
      { $push: { addresses: validatedData } },
      { new: true }
    ).select("addresses")

    return NextResponse.json(updatedUser.addresses)
  } catch (error) {
    console.error("[ADDRESSES_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 