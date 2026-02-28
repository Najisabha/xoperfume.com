import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Order } from '@/lib/models/order'
import connectDB from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia"
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await connectDB()

      let paymentIntentId = paymentIntent.id
      // Find the order with this payment intent
      const order = await Order.findOne({ paymentIntentId })

      if (!order) {
        console.error('Order not found for payment intent:', paymentIntentId)
        break
      }

      // Regular order payment
      await Order.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        {
          paymentStatus: 'paid',
          status: 'processing'
        }
      )

      break

    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent
      await connectDB()

      paymentIntentId = failedPaymentIntent.id
      // Update orders
      await Order.findOneAndUpdate(
        { paymentIntentId },
        { paymentStatus: 'failed' }
      )

      break
  }

  return NextResponse.json({ received: true })
}