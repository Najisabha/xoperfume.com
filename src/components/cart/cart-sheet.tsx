"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Minus, Plus, ShoppingBagIcon } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

export function CartSheet({ icon }: { icon?: boolean }) {
  const router = useRouter()
  const { state, removeItem, updateQuantity } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {icon ? (
          <div className="relative">
            <ShoppingBagIcon className="h-5 w-5 hover:cursor-pointer" />
            {state.items.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-accent text-foreground font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {state.items.length}
              </span>
            )}
          </div>
        ) : (
          <span className=" hover:cursor-pointer">Bag ({state.items.length})</span>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-[90%] flex-col bg-white sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Shopping Cart ({state.items.length})</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6">
            {state.items.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="divide-y">
                {state?.items?.map((item, index) => (
                  <div key={index} className="flex gap-4 py-4">
                    <div className="relative aspect-square h-20 w-20 min-w-[5rem] overflow-hidden rounded-lg">
                      <img
                        src={item.selectedVariant.images[0]}
                        alt={item.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            {item.selectedVariant.color && (
                              <p>Colour: {typeof item.selectedVariant.color === 'object'
                                ? `${(item.selectedVariant.color as any).name} (${(item.selectedVariant.color as any).hex})`
                                : item.selectedVariant.color}
                              </p>
                            )}
                            <p>{formatPrice(item.selectedVariant.price)}</p>
                          </div>
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
                        <div className="flex items-center rounded-md border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item._id, item.selectedVariant._id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
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
                            className="h-8 w-12 border-0 text-center"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item._id, item.selectedVariant._id, item.quantity + 1,)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.selectedVariant.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t px-6 py-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(state.total)}</span>
            </div>
            <Button
              className="mt-4 w-full"
              size="lg"
              onClick={() => {
                setOpen(false)
                router.push("/cart")
              }}
              disabled={state.items.length === 0}
            >
              View Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}