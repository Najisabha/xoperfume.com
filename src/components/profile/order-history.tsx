"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { formatDate } from "@/lib/date"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Placeholder } from "@/components/ui/placeholder"
import { Order } from "@/types"


export function OrderHistory({ lang, dict }: { lang: string, dict: any }) {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const t = dict?.profile || {}
  const ct = dict?.checkout || {}
  const isRtl = lang === 'ar' || lang === 'he'

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders?profile=true")
        if (!response.ok) throw new Error("Failed to fetch orders")
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        toast({
          title: dict?.auth?.error || "Error",
          description: (dict?.auth?.error_general || "Failed to load orders. Please try again later.") + error,
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
      <div className="text-center py-12">
        <p className="mb-6 text-lg text-muted-foreground">
          {t.empty_orders || "You haven't placed any orders yet"}
        </p>
        <Link href={`/${lang}/shop`}>
          <Button>{t.start_shopping || "Start Shopping"}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {orders?.map((order) => (
        <div
          key={order._id}
          className="rounded-lg border p-6 hover:shadow-sm transition-shadow"
        >
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <Link href={`/${lang}/orders/${order._id}`} className="hover:underline underline-offset-4">
                <p className="font-bold text-lg">{ct.order || 'Order'} #{order._id?.slice(-8).toUpperCase()}</p>
              </Link>
              <p className="text-sm text-muted-foreground">
                {ct.placed_on || 'Placed on'} {formatDate(order?.createdAt)}
              </p>
            </div>
            <div className={`text-${isRtl ? 'left' : 'right'} flex flex-col items-${isRtl ? 'start' : 'end'}`}>
              <p className="font-bold text-lg">{formatPrice(order.totalAmount)}</p>
              <div className="mt-1">
                {(() => {
                  const statusKey = order.status?.toLowerCase();
                  const statusText = (ct.status && ct.status[statusKey]) || order.status;
                  return (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border`}>
                      {statusText}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {order.products.map((item, index) => {
              const localizedName = lang === 'ar' ? item.product.name_ar : lang === 'he' ? item.product.name_he : item.product.name;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted/50">
                    <img
                      src={item.selectedVariant.images[0] || item.product.image || '/placeholder.png'}
                      alt={localizedName || item.product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between items-start">
                      <div className={isRtl ? 'text-right' : 'text-left'}>
                        <h4 className="font-medium text-base">{localizedName || item.product.name}</h4>
                        <div className="mt-1.5 text-xs text-muted-foreground space-y-0.5">
                          <p>{ct.quantity || 'Quantity'}: {item.quantity}</p>
                          {item.selectedVariant && (
                            <>
                              {item.selectedVariant.color && (
                                <p>{dict?.product?.colour || 'Colour'}: {(() => {
                                  const variantInProduct = item.product.variants?.find((v: any) => v._id?.toString() === item.selectedVariant._id?.toString());
                                  const colorObj = (typeof item.selectedVariant.color === 'object')
                                    ? item.selectedVariant.color
                                    : variantInProduct?.color;

                                  if (!colorObj || typeof colorObj === 'string') return item.selectedVariant.color;

                                  const c = colorObj as any;
                                  return (lang === 'ar' ? c.name_ar : lang === 'he' ? c.name_he : c.name) || c.name;
                                })()} </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <p className={`font-medium ${isRtl ? 'text-left' : 'text-right'}`}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
            <Button asChild variant="outline" size="sm">
              <Link href={`/${lang}/orders/${order._id}`}>
                {ct.view_order || 'View Order'}
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}