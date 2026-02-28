"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export function ShopSheet({
  icon,
  categories,
  products,
  loading,
  lang,
  label,
  dict
}: {
  icon?: boolean
  categories: any[]
  products: any[]
  loading: boolean
  lang: string
  label?: string
  dict?: any
}) {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  const closeSheet = () => {
    setOpen(false)
    setSelectedCategory(null)
  }

  const filteredProducts = selectedCategory
    ? products?.filter(product => product.category?._id === selectedCategory._id)
    : products?.slice(0, 4) // Show only 4 featured products when no category is selected

  return (
    <Sheet open={open} onOpenChange={stats => {
      setOpen(stats)
      if (!stats) setSelectedCategory(null)
    }}>
      <SheetTrigger asChild>
        {icon ? (
          <ShoppingBag className="h-5 w-5" />
        ) : (
          <span className="hover:cursor-pointer">{label || 'Shop'}</span>
        )}
      </SheetTrigger>
      <SheetContent
        side="left"
        className={`flex w-[90%] sm:w-full overflow-y-clip bg-white flex-col transition-all duration-300 ease-in-out ${selectedCategory ? 'max-w-[90%] sm:max-w-5xl' : 'max-w-[90%] sm:max-w-md'
          }`}
      >
        <SheetHeader>{dict?.shop?.sheet?.title || 'Shop Categories'}</SheetHeader>
        <div className="flex gap-4 h-full mt-8 relative">

          {/* Parent Categories */}
          <div className={`flex flex-col gap-2 z-50 ${selectedCategory ? 'w-full md:w-1/3' : 'w-full'} relative z-10`}>
            {loading ? (
              <div>{dict?.shop?.sheet?.loading || 'Loading categories...'}</div>
            ) : (
              categories?.map((category: any, index) => (
                <div key={index}>
                  {(index === 0) && (
                    <Link href={`/${lang}/shop`} className="flex justify-between flex-col p-2 hover:bg-accent rounded-md cursor-pointer" onClick={closeSheet}>
                      <span className="font-bold">
                        {dict?.shop?.sheet?.view_all || 'View All'}
                      </span>
                    </Link>
                  )}
                  <div
                    className={`flex flex-col p-2 hover:bg-accent rounded-md cursor-pointer
                    ${selectedCategory?._id === category._id ? 'bg-accent' : ''}`}
                    onClick={() => {
                      if (window.innerWidth < 640) { // sm breakpoint is 640px
                        window.location.href = `/${lang}/shop/${category.slug}`;
                      } else {
                        setSelectedCategory(category);
                      }
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {lang === 'ar' && category.name_ar ? category.name_ar : lang === 'he' && category.name_he ? category.name_he : category.name}
                      </span>
                      {category.subcategories?.length > 0 && (
                        <span className="text-sm text-muted-foreground">→</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Products Display */}
          {selectedCategory ? (
            <div className="w-full md:w-2/3 border-l pl-8 z-50 animate-in slide-in-from-right-1 h-[calc(100vh-150px)] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {lang === 'ar' && selectedCategory.name_ar ? selectedCategory.name_ar : lang === 'he' && selectedCategory.name_he ? selectedCategory.name_he : selectedCategory.name}
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    {selectedCategory.description || `${dict?.shop?.sheet?.explore || 'Explore our'} ${lang === 'ar' && selectedCategory.name_ar ? selectedCategory.name_ar : lang === 'he' && selectedCategory.name_he ? selectedCategory.name_he : selectedCategory.name} ${dict?.shop?.sheet?.explore_suffix || 'collection'}`}
                  </p>
                </div>

                {/* View All Link */}
                <Link
                  href={`/${lang}/shop/${selectedCategory.slug}`}
                  onClick={closeSheet}
                  className="inline-block mt-4 text-sm text-primary hover:underline"
                >
                  {dict?.shop?.sheet?.view_all_category || 'View all'} {lang === 'ar' && selectedCategory.name_ar ? selectedCategory.name_ar : lang === 'he' && selectedCategory.name_he ? selectedCategory.name_he : selectedCategory.name} →
                </Link>

                {/* Products Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product._id}
                      href={`/${lang}/products/${product.slug}`}
                      onClick={closeSheet}
                      className="group"
                    >
                      <div className="relative aspect-square mb-2">
                        <img
                          src={product.variants[0]?.images[0] || '/placeholder.png'}
                          alt={product.name}
                          className="object-cover rounded-md group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                      <h3 className="font-medium group-hover:font-black">{lang === 'ar' && product.name_ar ? product.name_ar : lang === 'he' && product.name_he ? product.name_he : product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(product.variants[0]?.price)}
                      </p>
                    </Link>
                  ))}
                </div>

              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}