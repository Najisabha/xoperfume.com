"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { formatDate } from "@/lib/date"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Placeholder } from "@/components/ui/placeholder"
import { Order } from "@/types"


export function OrderHistory({ lang }: { lang: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders?profile=true")
        if (!response.ok) throw new Error("Failed to fetch orders")
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again later." + error,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Placeholder
            key={i}
            className="rounded-lg border p-6"
            lines={4}
            imageSize="sm"
          />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4 text-lg text-muted-foreground">
          You haven&apos;t placed any orders yet
        </p>
        <Link href={`/${lang}/shop`}>
          <Button>Start Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {orders?.map((order) => (
        <div
          key={order._id}
          className="rounded-lg border p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Link href={`/${lang}/orders/${order._id}`}>
                <p className="font-medium">Order #{order._id}</p>
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatDate(order?.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatPrice(order.totalAmount)}</p>
              <p className="text-sm capitalize text-muted-foreground">
                {order.status}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {order.products.map((product, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border-b pb-4 last:border-0"
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                  <img
                    src={product.selectedVariant.images[0] || product.product.image || '/placeholder.png'}
                    alt={product.product.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{product.product.name}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Quantity: {product.quantity}
                      </p>
                      {product.selectedVariant && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          {product.selectedVariant.color && <span>Enamel Colour: {product.selectedVariant.color} </span>}
                          {product.selectedVariant.size && <span>Gold Colour: {product.selectedVariant.size} </span>}
                          {product.selectedVariant.caratSize && <span>Stones: {product.selectedVariant.caratSize} </span>}
                          {/* <span>SKU: {product.selectedVariant.sku}</span> */}
                        </div>
                      )}
                    </div>
                    <p className="text-right font-medium">
                      {formatPrice(product.price * product.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button asChild variant="outline">
              <Link href={`/${lang}/orders/${order._id}`}>
                View Order
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}