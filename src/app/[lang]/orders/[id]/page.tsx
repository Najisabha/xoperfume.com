import { OrderDetails } from "@/components/orders/order-details"
import { OrderNotFound } from "@/components/orders/order-not-found"
import { authConfig } from "@/lib/auth.config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/get-dictionary";


export default async function OrderPage({ params }: any) {
  const resolvedParams = await params;

  const session = await getServerSession(authConfig)

  if (!session) {
    redirect("/auth/signin")
  }

  const lang = resolvedParams.lang;
  const dict = await getDictionary(lang);
  const t = dict?.checkout || {};


  let order = null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/orders/${resolvedParams.id}`, { cache: 'no-store' });
    if (response.ok) {
      order = await response.json();
    }
  } catch (err) {
    console.warn("Internal fetch failed, retrying with localhost...");
    try {
      const internalRes = await fetch(`http://localhost:${process.env.PORT || 3000}/api/orders/${resolvedParams.id}`, { cache: 'no-store' });
      if (internalRes.ok) order = await internalRes.json();
    } catch (e) {
      console.error("Order fetch failed completely:", e);
    }
  }

  if (!order || order.error || order === undefined) {
    return (
      <div className="container mx-auto px-4 py-8">
        <OrderNotFound lang={lang} dict={dict} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8" dir={lang === 'ar' || lang === 'he' ? 'rtl' : 'ltr'}>
      <h1 className="mb-8 text-3xl font-bold">{t.order_details || 'Order Details'}</h1>
      <OrderDetails order={order} lang={lang} dict={dict} />
    </div>
  )
}