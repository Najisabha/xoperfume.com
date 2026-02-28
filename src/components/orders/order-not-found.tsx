"use client"

import Link from "next/link"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OrderNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-6 rounded-full bg-muted p-6">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      </div>
      <h2 className="mb-2 text-2xl font-semibold">Order Not Found</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        We couldn&apos;t find the order you&apos;re looking for. It might have been removed or the link is incorrect.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild variant="outline">
          <Link href="/en/profile?tab=orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            View Your Orders
          </Link>
        </Button>
        <Button asChild>
          <Link href="/en/shop">
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  )
}
