"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/utils"
import { Trash2 } from "lucide-react"

export function CartItems({ dict, lang }: { dict: any, lang: string }) {
  const { state, updateQuantity, removeItem } = useCart()
  const c = dict.cart

  if (state.items.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4 text-lg text-muted-foreground">
          {c.empty}
        </p>
        <Link href={`/${lang}/shop`}>
          <Button>{c.continue_shopping}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {state.items.map((item, index) => (
        <div
          key={index}
          className="flex gap-4 rounded-lg border p-4"
        >
          <Link
            href={`/${lang}/products/${item.slug}`}
            className="relative aspect-square h-24 overflow-hidden rounded-md"
          >
            <img
              src={item.selectedVariant.images[0]}
              alt={item.name}
              className="object-cover"
            />
          </Link>

          <div className="flex flex-1 flex-col justify-between">
            <div className="flex justify-between">
              <div>
                <Link
                  href={`/${lang}/products/${item.slug}`}
                  className="font-medium hover:underline"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPrice(item.selectedVariant.price)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item._id, item.selectedVariant._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  if (value > 0) {
                    updateQuantity(item._id, item.selectedVariant._id, value)
                  }
                }}
                className="w-20"
              />
              <p className="text-sm text-muted-foreground">
                {c.total}: {formatPrice(item.selectedVariant.price * item.quantity)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
