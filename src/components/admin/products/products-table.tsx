"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Search, ChevronUp, ChevronDown } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { DeleteAlert } from "./delete-alert"
import { Product } from "@/types"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// Add this helper above the component
const normalizeText = (text: string = ''): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setProducts(products.filter(product => product._id !== id))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
    setDeleteId(null)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Helper function to flatten categories
  const flattenCategories = (categories: any[]): any[] => {
    return categories.reduce((acc, category) => {
      acc.push(category)
      if (category.subcategories?.length) {
        acc.push(...flattenCategories(category.subcategories))
      }
      return acc
    }, [])
  }

  // Improve filtering and sorting logic
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(product => {
        // Search filter
        const searchTerms = normalizeText(searchQuery)
          .split(' ')
          .filter(term => term.length > 0);

        if (searchTerms.length > 0) {
          const searchableFields = [
            product.name,
            product.category?.name,
          ].map(field => normalizeText(field || ''));

          if (!searchTerms.every(term =>
            searchableFields.some(field => field.includes(term))
          )) {
            return false;
          }
        }

        // Updated category filter
        if (categoryFilter !== "all") {
          const categoryId = product.category?._id
          const selectedCategory = flattenCategories(categories).find(c => c.name === categoryFilter)
          if (!categoryId || !selectedCategory || categoryId !== selectedCategory._id) {
            return false
          }
        }

        // Stock filter
        const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
        const stockStatus = totalStock === 0 ? 'out_of_stock' 
          : totalStock < 5 ? 'low_stock' 
          : 'in_stock';

        if (stockFilter !== "all" && stockStatus !== stockFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const totalStockA = a.variants.reduce((sum, v) => sum + v.stock, 0);
        const totalStockB = b.variants.reduce((sum, v) => sum + v.stock, 0);
        const minPriceA = Math.min(...a.variants.map(v => v.price));
        const minPriceB = Math.min(...b.variants.map(v => v.price));

        if (sortField === "name") {
          return sortDirection === "asc" 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortField === "price") {
          return sortDirection === "asc"
            ? minPriceA - minPriceB
            : minPriceB - minPriceA;
        } else if (sortField === "stock") {
          return sortDirection === "asc"
            ? totalStockA - totalStockB
            : totalStockB - totalStockA;
        }
        return 0;
      });
  }, [products, searchQuery, categoryFilter, stockFilter, sortField, sortDirection, categories]);

  // Replace uniqueCategories with flattened categories
  const flatCategories = useMemo(() => {
    return flattenCategories(categories).map(cat => cat.name)
  }, [categories])

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {flatCategories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock Status</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Images</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="flex items-center space-x-1"
                >
                  Name
                  {sortField === "name" && (
                    sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("price")}
                  className="flex items-center space-x-1"
                >
                  Price Range
                  {sortField === "price" && (
                    sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("stock")}
                  className="flex items-center space-x-1"
                >
                  Total Stock
                  {sortField === "stock" && (
                    sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedProducts.map((product) => {
                const prices = product.variants.map(v => v.price);
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                const overallStatus = totalStock === 0 ? 'out_of_stock' 
                  : totalStock < 5 ? 'low_stock' 
                  : 'in_stock';

                // Get first variant images and count total images across all variants
                const firstVariantImages = product.variants[0]?.images || [];
                const totalImages = product.variants.reduce((sum, variant) => 
                  sum + (variant.images?.length || 0), 0);
                const hasMoreImages = totalImages > firstVariantImages.length;

                return (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                          {firstVariantImages.map((image, index) => (
                            <div 
                              key={index} 
                              className="relative w-12 h-12 rounded overflow-hidden border"
                            >
                              <img
                                src={image}
                                alt={`${product.name} variant 1 image ${index + 1}`}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))}
                        </div>
                        {hasMoreImages && (
                          <span className="text-xs text-muted-foreground">
                            +{totalImages - firstVariantImages.length} more images in other variants
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category?.name || 'Uncategorized'}</TableCell>
                    <TableCell>
                      {minPrice === maxPrice
                        ? formatPrice(minPrice)
                        : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}
                    </TableCell>
                    <TableCell>{totalStock}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${overallStatus === 'in_stock' ? 'bg-green-100 text-green-800' : 
                          overallStatus === 'low_stock' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {overallStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/edit/${product._id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteAlert
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </div>
  )
}