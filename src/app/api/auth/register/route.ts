import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { User } from "@/lib/models/user"
import * as z from "zod"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = registerSchema.parse(body)

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email })
    if (existingUser) {
      return new NextResponse("Email already registered", { status: 400 })
    }

    // Create user
    await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
    })

    return new NextResponse("User registered successfully", { status: 201 })
  } catch (error) {
    console.error("[REGISTER]", error)
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid data", { status: 400 })
    }
    return new NextResponse("Internal error", { status: 500 })
  }
}