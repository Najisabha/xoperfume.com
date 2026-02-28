import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { Order } from "@/lib/models/order"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { Product } from "@/lib/models/product"
import promocode from "@/lib/models/promocode"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    const searchParams = req.nextUrl.searchParams
    const profile = searchParams.get('profile')

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }


    await connectDB()
    await Product.find({})

    let orders = []
    if (session.user.role !== 'admin') {
      orders = await Order.find({ initiatorEmail: session.user.email })
        .sort({ createdAt: -1 })
        .populate({
          path: 'products.product',
          model: 'Product',
          select: 'name slug variants'
        })
    } else if (!profile) {
      orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate({
          path: 'products.product',
          model: 'Product',
          select: 'name slug variants'
        })
    }
    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig)
    await connectDB()
    const data = await req.json()

    const orderData = {
      userId: session?.user?.id,
      products: data.items.map((item: any) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.selectedVariant.price,
        selectedVariant: {
          _id: item.selectedVariant._id,
          sku: item.selectedVariant.sku,
          color: item.selectedVariant.color,
          size: item.selectedVariant.size,
          caratSize: item.selectedVariant.caratSize,
          price: item.selectedVariant.price,
          stock: item.selectedVariant.stock,
          images: item.selectedVariant.images,
          stockStatus: item.selectedVariant.stockStatus
        }
      })),
      message: data?.message,
      customerEmail: data.customerEmail,
      shippingAddress: data.shippingAddress,
      totalAmount: data.total,
      promoCode: data.promoCode ? {
        code: data.promoCode.code,
        discountType: data.promoCode.discountType,
        discountValue: data.promoCode.discount,
        calculatedDiscount: data.promoCode.calculatedDiscount,
        originalAmount: data.originalTotal,
        finalAmount: data.total,
      } : null,
      status: 'pending',
      paymentStatus: 'pending',
      initiatorEmail: session?.user?.email,
      paymentIntentId: data.paymentIntentId,
    }

    const order = await Order.create(orderData)

    // Handle promo code if exists
    if (data.promoCode?.code) {
      await promocode.findOneAndUpdate(
        { code: data.promoCode.code },
        {
          $inc: { usageCount: 1 },
          $push: {
            usageHistory: {
              orderId: order._id,
              originalAmount: data.originalTotal,
              discountedAmount: data.total,
              discountApplied: data.promoCode.calculatedDiscount,
              date: new Date()
            }
          }
        }
      )
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}