'use client'

import { useState, useEffect } from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Category } from "@/types"

export default function AddSubcategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(false)
  const [parentCategory, setParentCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: resolvedParams.categoryId,
    isSubcategory: true
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchParentCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${resolvedParams.categoryId}`)
        if (response.ok) {
          const data = await response.json()
          setParentCategory(data)
        }
      } catch (error) {
        console.error('Error fetching parent category:', error)
      }
    }

    fetchParentCategory()
  }, [resolvedParams.categoryId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error("Failed to create subcategory")
      
      toast({
        title: "Success",
        description: "Subcategory created successfully",
      })
      router.push("/admin/categories")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subcategory - " + error,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData(prev => ({
      ...prev,
      slug
    }));
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            Add Subcategory to {parentCategory?.name || 'Loading...'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Subcategory Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSlug}
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner /> : "Add Subcategory"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}