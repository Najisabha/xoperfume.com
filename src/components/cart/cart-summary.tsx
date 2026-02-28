"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/components/ui/use-toast"

export function CartSummary({ dict, lang }: { dict: any, lang: string }) {
  const { state: { total, items } } = useCart()
  const c = dict.cart

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">{c.order_summary}</h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>{c.subtotal}</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between">
          <span>{c.shipping}</span>
          <span>{c.calc_checkout}</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-medium">
            <span>{c.total}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-2">
          <Button
            asChild
            className="w-full"
            disabled={items.length === 0}
          >
            <Link href={`/${lang}/checkout`}>
              {c.checkout}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}