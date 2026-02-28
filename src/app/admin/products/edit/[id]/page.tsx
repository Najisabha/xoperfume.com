'use client'

import { use } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/components/admin/products/product-form"
import { useState, useEffect } from "react"
import { Product } from "@/types"

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    Promise.all([
      fetchProduct(resolvedParams.id),
      fetchCategories()
    ])
  }, [resolvedParams.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (data: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${resolvedParams.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to update product")
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      })
      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product" + error,
        variant: "destructive",
      })
    }
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product: {product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm 
            initialData={product}
            categories={categories} 
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}