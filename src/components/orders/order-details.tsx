"use client"

import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { formatDate } from "@/lib/date"
import { Button } from "@/components/ui/button"
import { OrderStatus } from "./order-status"
import { Order } from "@/types"

interface OrderDetailsProps {
  order: Order
  lang?: string
  dict?: any
}

export function OrderDetails({ order, lang, dict }: OrderDetailsProps) {
  if (!order) return null
  const t = dict?.checkout || {}
  const isRtl = lang === 'ar' || lang === 'he'

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-medium">{t.order || 'Order'} #{order?._id?.slice(0, 6)}</h2>
          <p className="text-sm text-muted-foreground">
            {t.placed_on || 'Placed on'} {formatDate(order?.createdAt)}
          </p>
        </div>
        <OrderStatus status={order.status} dict={dict} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-medium">{t.items || 'Items'}</h3>
          <div className="divide-y text-right">
            {order.products.map((item, idx) => {
              const localizedName = lang === 'ar' ? item.product.name_ar : lang === 'he' ? item.product.name_he : item.product.name;
              return (
                <div key={`${item.product._id}-${idx}`} className="flex gap-4 py-4">
                  <Link
                    href={`/${lang}/products/${item.product.slug}`}
                    className="relative aspect-square h-24 overflow-hidden rounded-md border bg-muted"
                  >
                    <img
                      src={item?.selectedVariant?.images[0] || "/fallback-image.jpg"}
                      alt={localizedName || item.product.name}
                      className="object-cover w-full h-full"
                    />
                  </Link>
                  <div className={`flex flex-1 flex-col justify-between ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div>
                      <Link
                        href={`/${lang}/products/${item.product.slug}`}
                        className="font-medium hover:underline"
                      >
                        {localizedName || item.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatPrice(item.selectedVariant.price)}
                      </p>
                      {item.selectedVariant.color && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {dict?.product?.colour || 'Colour'}: {(() => {
                            const variantInProduct = item.product.variants?.find((v: any) => v._id?.toString() === item.selectedVariant._id?.toString());
                            const colorObj = (typeof item.selectedVariant.color === 'object')
                              ? item.selectedVariant.color
                              : variantInProduct?.color;

                            if (!colorObj || typeof colorObj === 'string') return item.selectedVariant.color;

                            const c = colorObj as any;
                            return (lang === 'ar' ? c.name_ar : lang === 'he' ? c.name_he : c.name) || c.name;
                          })()}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.quantity || 'Quantity'}: {item.quantity}
                    </p>
                  </div>
                  <div className={isRtl ? 'text-left' : 'text-right'}>
                    <p className="font-medium">
                      {formatPrice(item.selectedVariant.price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">{t.summary || 'Order Summary'}</h3>
          <div className="rounded-lg border p-4 bg-muted/30">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t.subtotal || 'Subtotal'}</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t.shipping || 'Shipping'}</span>
                <span className="text-green-600 font-medium">{t.free || 'Free'}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>{t.total || 'Total'}</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="font-medium">{t.shipping_address || 'Shipping Address'}</h3>
          <div className="rounded-lg border p-4 bg-muted/30">
            <address className="not-italic text-sm space-y-1">
              <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address}</p>
              {order.shippingAddress.aptSuite && <p>{order.shippingAddress.aptSuite}</p>}
              <p>
                {order.shippingAddress.city}{order.shippingAddress.emirates ? `, ${order.shippingAddress.emirates}` : ''}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p dir="ltr" className={isRtl ? 'text-right' : ''}>{order.shippingAddress.phone}</p>
            </address>
          </div>

          <Button className="w-full mt-6" asChild>
            <Link href={`/${lang}/profile?tab=orders`}>{t.back_to_orders || 'Back to Orders'}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}