
import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { Newsletter } from "@/lib/models/newsletter"
import { checkAuth } from "@/lib/auth-check"

export async function POST(req: Request) {
  try {
    await connectDB()
    const { email } = await req.json()
    const subscriber = await Newsletter.create({ email })
    return NextResponse.json(subscriber, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to subscribe to newsletter" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const authError = await checkAuth("admin")
    if (authError) return authError

    await connectDB()
    const subscribers = await Newsletter.find().sort({ createdAt: -1 })
    return NextResponse.json(subscribers, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    )
  }
}