import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { Color } from "@/lib/models/color"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB()
        const { id } = await params
        const data = await req.json()

        if (!data.name || !data.hex) {
            return NextResponse.json(
                { error: "Name and Hex code are required" },
                { status: 400 }
            )
        }

        const color = await Color.findByIdAndUpdate(
            id,
            { name: data.name, name_ar: data.name_ar || '', name_he: data.name_he || '', hex: data.hex },
            { new: true }
        )

        if (!color) {
            return NextResponse.json(
                { error: "Color not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(color)
    } catch (error: any) {
        console.error("Color update error:", error)
        return NextResponse.json(
            { error: "Failed to update color", details: error.message },
            { status: 500 }
        )
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB()
        const { id } = await params
        const color = await Color.findByIdAndDelete(id)

        if (!color) {
            return NextResponse.json(
                { error: "Color not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ message: "Color deleted successfully" })
    } catch (error: any) {
        console.error("Color deletion error:", error)
        return NextResponse.json(
            { error: "Failed to delete color", details: error.message },
            { status: 500 }
        )
    }
}
