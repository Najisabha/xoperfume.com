import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { checkAuth } from "@/lib/auth-check"
import { authConfig } from "@/lib/auth.config"
import connectDB from "@/lib/db"
import { SessionService } from "@/lib/services/session.service"
import { Session } from "@/lib/models/session"

// Get all active sessions for the current user
export async function GET() {
  try {
    const authError = await checkAuth()
    if (authError) return authError

    const session = await getServerSession(authConfig)
    await connectDB()

    await SessionService.cleanup()
    const sessions = await SessionService.getSessionsWithUser({ 
      userId: session!.user.id,
      isActive: true 
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("[SESSIONS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// Revoke a specific session
export async function DELETE(req: Request) {
  try {
    const authError = await checkAuth()
    if (authError) return authError

    const session = await getServerSession(authConfig)
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("id")

    if (!sessionId) {
      return new NextResponse("Session ID is required", { status: 400 })
    }

    await connectDB()

    // Only allow users to revoke their own sessions
    const targetSession = await Session.findOne({
      _id: sessionId,
      userId: session!.user.id,
    })

    if (!targetSession) {
      return new NextResponse("Session not found", { status: 404 })
    }

    await Session.findByIdAndUpdate(sessionId, {
      $set: { isActive: false, revokedAt: new Date() }
    })

    return new NextResponse("Session revoked successfully", { status: 200 })
  } catch (error) {
    console.error("[SESSIONS_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// Add new endpoint for revoking all other sessions
export async function POST(req: Request) {
  try {
    const authError = await checkAuth()
    if (authError) return authError

    const session = await getServerSession(authConfig)
    await connectDB()

    await SessionService.cleanup()
    await Session.updateMany(
      {
        userId: session!.user.id,
        _id: { $ne: session!.user.id },
        isActive: true
      },
      {
        isActive: false,
        revokedAt: new Date()
      }
    )

    return new NextResponse("All other sessions revoked successfully", { status: 200 })
  } catch (error) {
    console.error("[SESSIONS_REVOKE_ALL]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}