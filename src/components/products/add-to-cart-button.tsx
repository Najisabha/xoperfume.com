"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import type { Product, ProductVariant } from "@/types"
import { Spinner } from "@/components/ui/spinner"

interface AddToCartButtonProps {
  product: Product
  selectedVariant: ProductVariant
  disabled?: boolean
}

export function AddToCartButton({ product, selectedVariant, disabled }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = () => {
    try {
      setIsLoading(true)

      // Validate quantity against stock
      if (quantity > selectedVariant.stock) {
        throw new Error(`Only ${selectedVariant.stock} items available`);
      }

      addItem({ 
        ...product, 
        selectedVariant, 
        quantity 
      })

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex w-[100px] items-center">
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value)
            if (value > 0) setQuantity(value)
          }}
          className="text-center"
        />
      </div>
      <Button
        onClick={handleAddToCart}
        disabled={isLoading || disabled}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span>Adding...</span>
          </div>
        ) : (
          disabled ? "Out of Stock" : "Add to Cart"
        )}
      </Button>
    </div>
  )
}