"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Product, ProductVariant } from "@/types"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, XCircle, ShoppingBag } from "lucide-react"
import { ProductCard } from "@/components/product-card"

interface ProductDetailsProps {
  product: Product | null
  lang?: string
  dict?: any
  relatedProducts?: Product[]
}

export function ProductDetails({ product, lang, dict, relatedProducts = [] }: ProductDetailsProps) {
  const { addItem } = useCart()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants[0] || null
  )
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => ({
    color: (typeof product?.variants[0]?.color === 'object'
      ? (product?.variants[0]?.color as any)?._id
      : product?.variants[0]?.color) || ''
  }))
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const isRTL = lang === 'ar' || lang === 'he'
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  const t = dict?.product || {}

  if (!product || !selectedVariant) {
    return (
      <div className="container mx-auto w-full h-[50vh] flex items-center justify-center">
        <p className="text-xl text-muted-foreground">{t.not_found || 'Product not found'}</p>
      </div>
    )
  }

  // ── Localization helpers ────────────────────────────────────────────
  const localizedProductName =
    lang === 'ar' && product.name_ar ? product.name_ar :
      lang === 'he' && product.name_he ? product.name_he :
        product.name

  const localizedDescription =
    lang === 'ar' && selectedVariant.description_ar ? selectedVariant.description_ar :
      lang === 'he' && selectedVariant.description_he ? selectedVariant.description_he :
        selectedVariant.description

  const localizedCategoryName =
    lang === 'ar' && (product.category as any)?.name_ar ? (product.category as any).name_ar :
      lang === 'he' && (product.category as any)?.name_he ? (product.category as any).name_he :
        product.category?.name

  // ── Variant helpers ─────────────────────────────────────────────────
  const getAvailableOptions = (attribute: string) =>
    product.variants.reduce((acc, variant) => {
      const val = variant[attribute as keyof ProductVariant]
      const value = typeof val === 'object' ? (val as any)?._id : val
      if (value !== undefined && value !== '') acc.add(String(value))
      return acc
    }, new Set<string>())

  const handleVariantChange = (attribute: string, value: string) => {
    const newAttrs = { ...selectedAttributes, [attribute]: value }
    setSelectedAttributes(newAttrs)
    const found = product.variants.find(v =>
      Object.entries(newAttrs).every(([k, sel]) => {
        if (!sel) return true
        const val = v[k as keyof ProductVariant]
        return (typeof val === 'object' ? (val as any)?._id : String(val)) === sel
      })
    )
    if (found) { setSelectedVariant(found); setSelectedImageIndex(0) }
  }

  // ── Stock display ───────────────────────────────────────────────────
  const stockMap: Record<string, { label: string; color: string; icon: any }> = {
    in_stock: { label: t.in_stock || 'In Stock', color: 'text-emerald-600', icon: CheckCircle2 },
    low_stock: { label: t.low_stock || 'Low Stock', color: 'text-amber-500', icon: AlertCircle },
    out_of_stock: { label: t.out_of_stock || 'Out of Stock', color: 'text-red-500', icon: XCircle },
  }
  const stockInfo = stockMap[selectedVariant.stockStatus] || stockMap.in_stock
  const StockIcon = stockInfo.icon

  // ── Add to cart ─────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (selectedVariant.stockStatus === 'out_of_stock') return
    setIsAddingToCart(true)
    try {
      addItem({ ...product, selectedVariant, quantity })
      toast({ title: t.add_to_cart || 'Added to cart', description: localizedProductName })
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const isOutOfStock = selectedVariant.stockStatus === 'out_of_stock'
  const isPriceOnRequest = selectedVariant.price === 0

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ── Breadcrumb ──────────────────────────────────────────────── */}
      <nav className="container mx-auto px-4 py-6">
        <ol className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground">
          <li>
            <Link href={`/${lang}`} className="hover:text-foreground transition-colors">
              {t.home || 'Home'}
            </Link>
          </li>
          <li><ChevronIcon className="h-3.5 w-3.5 shrink-0 opacity-50" /></li>
          <li>
            <Link href={`/${lang}/shop`} className="hover:text-foreground transition-colors">
              {t.shop || 'Shop'}
            </Link>
          </li>
          {product.category?.slug && (
            <>
              <li><ChevronIcon className="h-3.5 w-3.5 shrink-0 opacity-50" /></li>
              <li>
                <Link
                  href={`/${lang}/shop?category=${product.category.slug}`}
                  className="hover:text-foreground transition-colors capitalize"
                >
                  {localizedCategoryName}
                </Link>
              </li>
            </>
          )}
          <li><ChevronIcon className="h-3.5 w-3.5 shrink-0 opacity-50" /></li>
          <li className="text-foreground font-medium truncate max-w-[200px]">{localizedProductName}</li>
        </ol>
      </nav>

      {/* ── Product grid ────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-[minmax(0,500px)_1fr] xl:grid-cols-[minmax(0,600px)_1fr] gap-6 lg:gap-10">

          {/* LEFT — images ──────────────────────────────────────────── */}
          <div className="flex gap-3">
            {/* Vertical thumbnails (desktop) */}
            {selectedVariant.images.length > 1 && (
              <div className="hidden md:flex flex-col gap-2 w-16 shrink-0">
                {selectedVariant.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`aspect-square overflow-hidden rounded border-2 transition-all ${i === selectedImageIndex
                      ? 'border-primary ring-1 ring-primary/30'
                      : 'border-transparent hover:border-primary/40'
                      }`}
                  >
                    <img src={img} alt={`${localizedProductName} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 w-full max-w-xl mx-auto lg:mx-0">
              <div className="aspect-square overflow-hidden rounded-xl bg-muted/30">
                <img
                  src={selectedVariant.images[selectedImageIndex]}
                  alt={localizedProductName}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>

              {/* Mobile thumbnails */}
              {selectedVariant.images.length > 1 && (
                <div className="flex md:hidden gap-2 mt-3 overflow-x-auto pb-1">
                  {selectedVariant.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`shrink-0 w-14 h-14 overflow-hidden rounded border-2 transition-all ${i === selectedImageIndex
                        ? 'border-primary ring-1 ring-primary/30'
                        : 'border-transparent hover:border-primary/40'
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — details ────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-5">

            {/* Title + price */}
            <div>
              {/* Country badges */}
              {product.countries?.length > 0 && (
                <div className="flex gap-1 mb-2">
                  {product.countries.map(c => (
                    <span key={c} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full uppercase font-bold text-muted-foreground border tracking-wider">
                      {c}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-2xl font-bold tracking-tight leading-tight">{localizedProductName}</h1>
              {!isPriceOnRequest && (
                <p className="text-2xl font-semibold text-primary mt-1">{formatPrice(selectedVariant.price)}</p>
              )}
            </div>

            {/* Stock status */}
            <div className={`flex items-center gap-1.5 text-sm font-medium ${stockInfo.color}`}>
              <StockIcon className="h-4 w-4" />
              <span>{stockInfo.label}</span>
            </div>

            {/* Description */}
            {localizedDescription && (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap border-t pt-4">
                {localizedDescription}
              </p>
            )}

            {/* Color selector */}
            {getAvailableOptions('color').size > 0 && (
              <div className="space-y-3 border-t pt-4">
                {(() => {
                  const availableOptions = getAvailableOptions('color')
                  const selectedValue = selectedAttributes['color']
                  const selectedVariantWithInfo = product.variants.find(v => {
                    const val = v['color' as keyof ProductVariant]
                    return (typeof val === 'object' ? (val as any)?._id : val) === selectedValue
                  })
                  const selectedColorName =
                    lang === 'ar' && (selectedVariantWithInfo?.color as any)?.name_ar
                      ? (selectedVariantWithInfo?.color as any)?.name_ar
                      : lang === 'he' && (selectedVariantWithInfo?.color as any)?.name_he
                        ? (selectedVariantWithInfo?.color as any)?.name_he
                        : (selectedVariantWithInfo?.color as any)?.name
                  const selectedHex = (selectedVariantWithInfo?.color as any)?.hex

                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                          {t.colour || 'Colour'}
                        </Label>
                        {selectedColorName && (
                          <span className="text-sm font-medium flex items-center gap-1.5">
                            {selectedHex && (
                              <span
                                className="inline-block w-3.5 h-3.5 rounded-full border border-black/10"
                                style={{ backgroundColor: selectedHex }}
                              />
                            )}
                            {selectedColorName}
                          </span>
                        )}
                      </div>
                      <RadioGroup
                        value={selectedValue}
                        onValueChange={v => handleVariantChange('color', v)}
                        className="flex flex-wrap gap-3"
                        dir={lang === 'ar' || lang === 'he' ? 'rtl' : 'ltr'}
                      >
                        {Array.from(availableOptions).map(value => {
                          const variantWithColor = product.variants.find(v => {
                            const val = v['color' as keyof ProductVariant]
                            return (typeof val === 'object' ? (val as any)?._id : val) === value
                          })
                          const colorObj = variantWithColor?.color as any
                          const titleStr =
                            lang === 'ar' && colorObj?.name_ar ? colorObj.name_ar :
                              lang === 'he' && colorObj?.name_he ? colorObj.name_he :
                                colorObj?.name
                          return (
                            <div key={value}>
                              <RadioGroupItem value={value} id={`color-${value}`} className="peer sr-only" />
                              <Label
                                htmlFor={`color-${value}`}
                                title={titleStr}
                                className="relative flex items-center justify-center cursor-pointer transition-all
                                  peer-data-[state=checked]:scale-110
                                  peer-data-[state=checked]:after:absolute
                                  peer-data-[state=checked]:after:inset-[-5px]
                                  peer-data-[state=checked]:after:rounded-full
                                  peer-data-[state=checked]:after:border-2
                                  peer-data-[state=checked]:after:border-primary
                                  rounded-full group"
                              >
                                <div
                                  className="size-9 rounded-full border border-black/10 shadow-sm transition-transform group-hover:scale-105"
                                  style={{ backgroundColor: colorObj?.hex || '#ccc' }}
                                />
                              </Label>
                            </div>
                          )
                        })}
                      </RadioGroup>
                    </>
                  )
                })()}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="border-t pt-4 space-y-3">
              {isPriceOnRequest ? (
                <p className="text-base font-medium text-muted-foreground py-2">
                  {t.price_on_request || 'Price Available on Request'}
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground whitespace-nowrap">
                      {t.qty || 'Qty'}
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={selectedVariant.stock}
                      value={quantity}
                      onChange={e => {
                        const v = parseInt(e.target.value)
                        if (v > 0) setQuantity(v)
                      }}
                      className="w-20 text-center h-9"
                      disabled={isOutOfStock}
                    />
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || isOutOfStock}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {isAddingToCart ? (
                      <><Spinner size="sm" /><span>{t.adding || 'Adding...'}</span></>
                    ) : isOutOfStock ? (
                      <>{t.out_of_stock_btn || 'Out of Stock'}</>
                    ) : (
                      <><ShoppingBag className="h-4 w-4" /><span>{t.add_to_cart || 'Add to Cart'}</span></>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Related Products ───────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t pt-10">
            <h2 className="text-xl font-semibold mb-6">{t.related_products || 'You May Also Like'}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedProducts.map(p => (
                <ProductCard key={p._id} product={p} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}