import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { SessionService } from "@/lib/services/session.service"
import connectDB from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { userAgent, ipAddress } = await req.json()
    await connectDB()

    await SessionService.updateSession(
      { 
        userId: session.user.id, 
      },
      {
        $set: {
          userAgent,
          ipAddress,
          deviceName: SessionService.createDeviceName(userAgent),
          lastAccessed: new Date(),
          userEmail: session.user.email,
          userName: session.user.name
        }
      },
      { upsert: true } // This will create if doesn't exist or update if exists
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[SESSION_UPDATE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}