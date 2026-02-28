import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { Order } from "@/lib/models/order"
import { checkAuth } from "@/lib/auth-check"

export async function GET(req: Request, { params }: any) {
  const param = await params
  try {
    // const authError = await checkAuth("user")
    // if (authError) return authError

    await connectDB()
    const order = await Order.findOne({
      _id: param.id,
      // userId: session?.user.id 
    }).populate("products.product")

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(order, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request, { params }: any) {
  const param = await params
  try {
    const authError = await checkAuth("admin")
    if (authError) return authError

    const { status } = await req.json()
    
    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    await connectDB()
    const order = await Order.findByIdAndUpdate(
      param.id,
      { status },
      { new: true }
    ).populate("products.product")

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(order, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}