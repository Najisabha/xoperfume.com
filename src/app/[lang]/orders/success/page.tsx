
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="mt-6 text-3xl font-bold">Payment Successful!</h1>
      <p className="mt-4 text-muted-foreground">
        Thank you for your purchase. Your order has been processed successfully.
      </p>
      <div className="mt-8 space-x-4">
        <Button asChild>
          <Link href="/orders">View Orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}