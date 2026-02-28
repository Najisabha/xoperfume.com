'use client'

import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/components/admin/products/product-form"
import { useState, useEffect } from "react"

export default function AddProductPage() {
  const [categories, setCategories] = useState([])
  const [colors, setColors] = useState([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
    fetchColors()
  }, [])

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

  const fetchColors = async () => {
    try {
      const response = await fetch('/api/colors')
      if (response.ok) {
        const data = await response.json()
        setColors(data)
      }
    } catch (error) {
      console.error('Error fetching colors:', error)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to create product")

      toast({
        title: "Success",
        description: "Product created successfully",
      })
      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product" + error,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            categories={categories}
            colors={colors}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}