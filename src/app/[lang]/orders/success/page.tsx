import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDictionary } from "@/lib/get-dictionary"

export default async function OrderSuccessPage({ params, searchParams }: any) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const lang = resolvedParams.lang;
  const dict = await getDictionary(lang);
  const orderId = resolvedSearchParams.id;

  const t = dict?.checkout || {};
  const isRtl = lang === 'ar' || lang === 'he';

  return (
    <div className="container mx-auto px-4 py-32 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
      <CheckCircle2 className="mx-auto h-20 w-20 text-green-500 animate-in fade-in zoom-in duration-500" />
      <h1 className="mt-8 text-4xl font-bold tracking-tight">
        {t.order_success || "Thank You!"}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        {t.order_success_desc || "Your order has been placed successfully. We will contact you once your items are on the way."}
      </p>

      {orderId && (
        <div className="mt-6 p-4 rounded-lg bg-muted/50 inline-block border">
          <span className="text-sm font-medium text-muted-foreground mr-2">
            Order ID:
          </span>
          <span className="font-mono text-primary">#{orderId}</span>
        </div>
      )}

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button size="lg" className="px-8" asChild>
          <Link href={`/${lang}/orders/${orderId || ""}`}>
            {t.view_order_status || "View Order Status"}
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="px-8" asChild>
          <Link href={`/${lang}/shop`}>
            {t.continue_shopping || "Continue Shopping"}
          </Link>
        </Button>
      </div>
    </div>
  )
}