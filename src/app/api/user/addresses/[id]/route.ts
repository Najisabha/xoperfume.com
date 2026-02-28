
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/db"
import { User } from "@/lib/models/user"
import { authConfig } from "@/lib/auth.config"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const resolvedParams = await params
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await connectDB()
    const user = await User.findById(session.user.id)
    
    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const addressIndex = user.addresses.findIndex(
      (addr: any) => addr._id.toString() === resolvedParams.id
    )

    if (addressIndex === -1) {
      return new NextResponse("Address not found", { status: 404 })
    }

    user.addresses.splice(addressIndex, 1)
    await user.save()

    return NextResponse.json(user.addresses)
  } catch (error) {
    console.error("[ADDRESS_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}