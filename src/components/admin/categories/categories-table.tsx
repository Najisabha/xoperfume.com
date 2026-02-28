"use client"

import { useState, useEffect, Fragment } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { DeleteAlert } from "../products/delete-alert"
import { Category } from "@/types"


export function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
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
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setCategories(categories.filter(category => category._id !== id))
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
    setDeleteId(null)
  }

  if (loading) return <div>Loading...</div>

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {categories.map((category) => (
            <Fragment key={category._id}>
              <TableRow>
              <TableCell>
                {category.imageUrl ? (
                <img 
                  src={category.imageUrl} 
                  alt={category.name}
                  className="w-10 h-10 object-cover rounded-md"
                  onError={(e) => e.currentTarget.src = '/placeholder.jpg'}
                />
                ) : '-'}
              </TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>Main Category</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>{category.description || '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                <Link href={`/admin/categories/edit/${category._id}`}>
                  <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(category._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Link href={`/admin/categories/${category._id}/subcategories/new`}>
                  <Button variant="ghost" size="sm">
                  Add Subcategory
                  </Button>
                </Link>
                </div>
              </TableCell>
              </TableRow>
              {category.subcategories?.map((sub) => (
              <TableRow key={sub._id} className="bg-muted/50">
                <TableCell>
                {sub.imageUrl ? (
                  <img 
                  src={sub.imageUrl} 
                  alt={sub.name}
                  className="w-10 h-10 object-cover rounded-md ml-8"
                  onError={(e) => e.currentTarget.src = '/placeholder.jpg'}
                  />
                ) : '-'}
                </TableCell>
                <TableCell className="pl-8">└─ {sub.name}</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>{sub.slug}</TableCell>
                <TableCell>{sub.description || '-'}</TableCell>
                <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/categories/edit/${sub._id}`}>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  </Link>
                  <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(sub._id)}
                  >
                  <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                </TableCell>
              </TableRow>
              ))}
            </Fragment>
            ))}
        </TableBody>
      </Table>

      <DeleteAlert
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </>
  )
}
