"use client"

import { useWishlist } from "@/contexts/wishlist-context"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function WishlistPage() {
  const { state, clearWishlist } = useWishlist()

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <Heart className="h-16 w-16 text-muted-foreground/30" />
          </div>
          <h1 className="mb-4 text-2xl font-bold">Your Wishlist is Empty</h1>
          <p className="mb-8 text-muted-foreground">
            Start saving your favorite pieces for later by clicking the heart icon on any product.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button className="flex w-full items-center gap-2 sm:w-auto">
                <ShoppingBag className="h-4 w-4" />
                Browse Collections
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" className="w-full sm:w-auto">
                Discover New Arrivals
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">
            {state.items.length} {state.items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <Button variant="outline" onClick={clearWishlist}>
          Clear Wishlist
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {state.items.map((product) => (
          <div key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}