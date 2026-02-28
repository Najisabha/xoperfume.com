"use client"

import Link from "next/link"
import { ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrderNotFoundProps {
  lang?: string
  dict?: any
}

export function OrderNotFound({ lang = 'en', dict }: OrderNotFoundProps) {
  const t = dict?.checkout || {}
  const isRtl = lang === 'ar' || lang === 'he'

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 rounded-full bg-muted p-8 ring-8 ring-muted/30">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/60" aria-hidden="true" />
      </div>
      <h2 className="mb-3 text-3xl font-bold tracking-tight">
        {t.not_found || 'Order Not Found'}
      </h2>
      <p className="mb-10 max-w-md text-lg text-muted-foreground leading-relaxed">
        {t.not_found_desc || "We couldn't find the order you're looking for. It might have been removed or the link is incorrect."}
      </p>
      <div className={`flex flex-col gap-4 sm:flex-row ${isRtl ? 'flex-row-reverse' : ''}`}>
        <Button asChild variant="outline" size="lg" className="min-w-[200px]">
          <Link href={`/${lang}/profile?tab=orders`}>
            {isRtl ? (
              <ArrowRight className="ml-2 h-4 w-4" />
            ) : (
              <ArrowLeft className="mr-2 h-4 w-4" />
            )}
            {t.view_your_orders || 'View Your Orders'}
          </Link>
        </Button>
        <Button asChild size="lg" className="min-w-[200px]">
          <Link href={`/${lang}/shop`}>
            {dict?.common?.continue_shopping || t.continue_shopping || 'Continue Shopping'}
          </Link>
        </Button>
      </div>
    </div>
  )
}
