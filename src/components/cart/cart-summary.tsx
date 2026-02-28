"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/components/ui/use-toast"

export function CartSummary() {
  const { state: { total, items } } = useCart()

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-2">
          <Button
            asChild
            className="w-full"
            disabled={items.length === 0}
          >
            <Link href="/checkout">
              Proceed to Checkout
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}