import { OrderDetails } from "@/components/orders/order-details"
import { OrderNotFound } from "@/components/orders/order-not-found"
import { authConfig } from "@/lib/auth.config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function OrderPage({ params }: any) {
  const resolvedParams = await params;

  const session = await getServerSession(authConfig)

  if (!session) {
    redirect("/auth/signin")
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/${resolvedParams.id}`)
  const order = await response.json()

  if (!order || order.error || order === undefined) {
    return (
      <div className="container mx-auto px-4 py-8">
        <OrderNotFound />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Order Details</h1>
      <OrderDetails order={order} />
    </div>
  )
}