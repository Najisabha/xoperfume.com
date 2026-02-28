import { formatPrice } from "@/lib/utils"
import { CartItem } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface OrderSummaryProps {
  items: CartItem[]
  total: number
  promoCode: string
  setPromoCode: (code: string) => void
  onApplyPromo: () => void
  isValidatingPromo: boolean
  appliedPromo: any
  originalTotal?: number
  onRemovePromo: () => void
}

export function OrderSummary({ 
  items, 
  total,
  promoCode,
  setPromoCode,
  onApplyPromo,
  isValidatingPromo,
  appliedPromo,
  originalTotal,
  onRemovePromo
}: OrderSummaryProps) {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-medium">Order Summary</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span className="text-muted-foreground">
              {formatPrice(item.selectedVariant.price * item.quantity)}
            </span>
          </div>
        ))}
        
        {!appliedPromo ? (
          <>
          {/* PromoCode goes here */}
          </>
          // <div className="flex gap-2 mb-4">
          //   <Input
          //     placeholder="Enter promo code"
          //     value={promoCode}
          //     onChange={(e) => setPromoCode(e.target.value)}
          //     className="uppercase"
          //   />
          //   <Button
          //     type="button"
          //     variant="outline"
          //     onClick={onApplyPromo}
          //     disabled={isValidatingPromo || !promoCode}
          //   >
          //     {isValidatingPromo ? <Spinner /> : "Apply"}
          //   </Button>
          // </div>
        ) : (
          <div className="flex justify-between items-center mb-4 p-2 bg-muted rounded">
            <div>
              <p className="text-sm font-medium">Promo code: {appliedPromo.code}</p>
              <p className="text-sm text-green-600">
                Discount: ${appliedPromo.calculatedDiscount.toFixed(2)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemovePromo}
            >
              Remove
            </Button>
          </div>
        )}

        <div className="border-t pt-4">
          {appliedPromo && (
            <>
              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal</span>
                <span className="text-muted-foreground">{formatPrice(originalTotal || total)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2 text-green-600">
                <span>Promo Code Discount</span>
                <span>-{formatPrice(appliedPromo.calculatedDiscount)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-medium">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}