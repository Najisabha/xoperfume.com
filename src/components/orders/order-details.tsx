"use client"

import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { formatDate } from "@/lib/date"
import { Button } from "@/components/ui/button"
import { OrderStatus } from "./order-status"
import { Order } from "@/types"

interface OrderDetailsProps {
  order: Order
}

export function OrderDetails({ order }: OrderDetailsProps) {
  if (!order) return null
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-medium">Order #{order?._id?.slice(0, 6)}</h2>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order?.createdAt)}
          </p>
        </div>
        <OrderStatus status={order.status} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-medium">Items</h3>
          <div className="divide-y">
            {order.products.map((item) => (
              <div
                key={item.product._id}
                className="flex gap-4 py-4"
              >
                <Link
                  href={`/products/${item.product.slug}`}
                  className="relative aspect-square h-24 overflow-hidden rounded-md"
                >
                  <img
                    src={item?.selectedVariant?.images[0] || "/fallback-image.jpg"}
                    alt={item.product.name}
                    // fill
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(item.selectedVariant.price)}
                    </p>
                    {item.selectedVariant.size && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Gold Colour: {item.selectedVariant.size}
                      </p>
                    )}
                    {item.selectedVariant.color && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Enamel Colour: {item.selectedVariant.color}
                      </p>
                    )}
                    {item.selectedVariant.caratSize && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Stones: {item.selectedVariant.caratSize}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatPrice(item.selectedVariant.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Order Summary</h3>
          <div className="rounded-lg border p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="font-medium">Shipping Address</h3>
          <div className="rounded-lg border p-4">
            <address className="not-italic">
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address}</p>
              {order.shippingAddress.aptSuite && <p>{order.shippingAddress.aptSuite}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.emirates}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phone}</p>
            </address>
          </div>

          <Button className="w-full" asChild>
            <Link href="/profile?tab=orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}