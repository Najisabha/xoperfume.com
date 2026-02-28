"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { CheckoutForm } from "./checkout-form"
import { OrderSummary } from "./order-summary"
import { toast } from "@/components/ui/use-toast"
import Cookies from 'js-cookie'

export default function CheckoutPageClient({ lang, dict }: { lang: string, dict: any }) {
  const { state: { items, total } } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<any>(null)
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  // Check for existing promo code in cookies on mount
  useEffect(() => {
    const savedPromo = Cookies.get('temp_promo')
    if (savedPromo) {
      try {
        const promoData = JSON.parse(savedPromo)
        setAppliedPromo(promoData)
      } catch (error) {
        Cookies.remove('temp_promo')
      }
    }
  }, [])

  // Check for existing payment intent in cookies
  useEffect(() => {
    const savedPaymentIntent = Cookies.get('temp_payment_intent')
    if (savedPaymentIntent) {
      setPaymentIntentId(savedPaymentIntent)
    }
  }, [])

  const finalTotal = appliedPromo
    ? total - appliedPromo.calculatedDiscount
    : total

  async function validatePromoCode() {
    setIsValidatingPromo(true)

    try {
      const response = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, orderAmount: total }),
      })
      const data = await response.json()

      if (data.valid) {
        setAppliedPromo(data.promoCode)
        Cookies.set('temp_promo', JSON.stringify(data.promoCode), { expires: 1 / 24 })

        // Update payment intent with new amount
        await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total - data.promoCode.calculatedDiscount,
            promoCode: data.promoCode,
            paymentIntentId: paymentIntentId
          }),
        })

        toast({
          title: "Promo code applied!",
          description: `Discount: $${data.promoCode.calculatedDiscount.toFixed(2)}`,
        })
      } else {
        // Just remove the promo code and continue with original price
        Cookies.remove('temp_promo')
        setAppliedPromo(null)

        // Update payment intent with original amount
        await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            paymentIntentId: paymentIntentId
          }),
        })

        toast({
          title: "Invalid promo code",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate promo code",
        variant: "destructive",
      })
    } finally {
      setIsValidatingPromo(false)
    }
  }

  function removePromoCode() {
    Cookies.remove('temp_promo')
    setAppliedPromo(null)
    setPromoCode("")
  }

  if (items.length === 0) {
    return null
  }

  const isRTL = lang === 'ar' || lang === 'he'

  return (
    <div className="container mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="mb-8 text-3xl font-bold">{dict?.checkout?.title || 'Checkout'}</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <CheckoutForm
          finalTotal={finalTotal}
          appliedPromo={appliedPromo}
          paymentIntentId={paymentIntentId}
          setPaymentIntentId={setPaymentIntentId}
          lang={lang}
          dict={dict}
        />
        <OrderSummary
          items={items}
          total={finalTotal}
          originalTotal={total}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          onApplyPromo={validatePromoCode}
          onRemovePromo={removePromoCode}
          isValidatingPromo={isValidatingPromo}
          appliedPromo={appliedPromo}
          lang={lang}
          dict={dict}
        />
      </div>
    </div>
  )
}