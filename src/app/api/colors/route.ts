import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { Color } from "@/lib/models/color"

export async function GET() {
    try {
        await connectDB()
        const colors = await Color.find().sort({ name: 1 }).exec()
        return NextResponse.json(colors)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Failed to fetch colors" },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        await connectDB()
        const data = await req.json()

        if (!data.name || !data.hex) {
            return NextResponse.json(
                { error: "Name and Hex code are required" },
                { status: 400 }
            )
        }

        const color = await Color.create({
            name: data.name,
            name_ar: data.name_ar || '',
            name_he: data.name_he || '',
            hex: data.hex,
        })

        return NextResponse.json(color, { status: 201 })
    } catch (error: any) {
        console.error("Color creation error:", error)
        return NextResponse.json(
            { error: "Failed to create color", details: error.message },
            { status: 500 }
        )
    }
}
