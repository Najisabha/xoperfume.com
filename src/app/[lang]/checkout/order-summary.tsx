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
  lang?: string
  dict?: any
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
  onRemovePromo,
  lang,
  dict
}: OrderSummaryProps) {
  const t = dict?.checkout || {}
  const isRtl = lang === 'ar' || lang === 'he'

  return (
    <div className="rounded-lg border p-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <h2 className="mb-4 text-lg font-medium">{t.summary || 'Order Summary'}</h2>
      <div className="space-y-4">
        {items.map((item, index) => {
          const localizedName = lang === 'ar' ? item.name_ar : lang === 'he' ? item.name_he : item.name;
          return (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {localizedName || item.name} × {item.quantity}
              </span>
              <span className="text-muted-foreground">
                {formatPrice(item.selectedVariant.price * item.quantity)}
              </span>
            </div>
          );
        })}

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
              <p className="text-sm font-medium">{t.promo_code || 'Promo code: '} {appliedPromo.code}</p>
              <p className="text-sm text-green-600">
                {t.discount || 'Discount: '} ${appliedPromo.calculatedDiscount.toFixed(2)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemovePromo}
            >
              {t.remove || 'Remove'}
            </Button>
          </div>
        )}

        <div className="border-t pt-4">
          {appliedPromo && (
            <>
              <div className="flex justify-between text-sm mb-2">
                <span>{t.subtotal || 'Subtotal'}</span>
                <span className="text-muted-foreground">{formatPrice(originalTotal || total)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2 text-green-600">
                <span>{t.promo_discount || 'Promo Code Discount'}</span>
                <span>-{formatPrice(appliedPromo.calculatedDiscount)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span className="font-medium">{t.total || 'Total'}</span>
            <span className="font-medium">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}