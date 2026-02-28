import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { Contact } from "@/lib/models/contact"
import { checkAuth } from "@/lib/auth-check"
import { serializeDocument } from "@/lib/utils/serialize"

export async function POST(req: Request) {
  try {
    await connectDB()
    const data = await req.json()
    const contact = await Contact.create(data)
    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const authError = await checkAuth("admin")
    if (authError) return authError

    await connectDB()
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json(serializeDocument(contacts), { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    )
  }
}