import { NextResponse } from "next/server"
import { checkAuth } from "@/lib/auth-check"
import connectDB from "@/lib/db"
import { SessionService } from "@/lib/services/session.service"

export async function GET() {
  try {
    const authError = await checkAuth('admin')
    if (authError) return authError

    await connectDB()
    await SessionService.cleanup()
    const sessions = await SessionService.getSessionsWithUser()

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("[ADMIN_SESSIONS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}