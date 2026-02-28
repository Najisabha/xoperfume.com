import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth.config"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia"
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig)
    const { amount, promoCode, paymentIntentId } = await req.json()

    let paymentIntent;

    // Try to fetch existing payment intent first
    if (paymentIntentId) {
      try {
        paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // Update if amount changed
        if (paymentIntent.amount !== Math.round(amount * 100)) {
          paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
            amount: Math.round(amount * 100),
            metadata: {
              promoCode: promoCode?.code || null,
              discountApplied: promoCode ? 'yes' : 'no',
              discountAmount: promoCode?.calculatedDiscount?.toString() || '0',
            },
          });
        }
      } catch (error) {
        console.error('Payment intent not found or expired, creating new one');
      }
    }

    // Create new payment intent if none exists or if retrieval failed
    if (!paymentIntent) {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          userId: session?.user.id ?? "unknown",
          promoCode: promoCode?.code || null,
          discountApplied: promoCode ? 'yes' : 'no',
          discountAmount: promoCode?.calculatedDiscount?.toString() || '0',
        },
      });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    )
  }
}