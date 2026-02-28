"use client"

import { useState } from "react"
import { Loader2, Plus, X, Wand2, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from "lucide-react"
import { Category, Product, ProductVariant } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/admin/image-upload"
import { ImageUrlsManager } from "./image-urls-manager"

interface ProductFormProps {
  initialData?: Partial<Product>
  categories: Category[]
  colors: Color[]
  onSubmit: (data: Partial<Product>) => Promise<void>
}

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Color } from "@/types"

const COUNTRIES = [
  { id: 'palastine', label: 'Palestine' },
  { id: 'uae', label: 'UAE' },
  { id: 'jordan', label: 'Jordan' },
]

interface FormErrors {
  name?: string;
  slug?: string;
  category?: string;
  variants?: string;
  variantErrors?: {
    [key: number]: {
      sku?: string;
      price?: string;
      stock?: string;
      images?: string;
      description?: string;
    }
  }
}

export function ProductForm({ initialData = {}, categories, colors, onSubmit }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const { toast } = useToast()
  const [expandedVariant, setExpandedVariant] = useState<number | null>(0) // Default expand first variant

  const [formData, setFormData] = useState({
    name: initialData.name ?? "",
    name_ar: (initialData as any).name_ar ?? "",
    name_he: (initialData as any).name_he ?? "",
    basePrice: initialData.basePrice ?? 0,
    category: initialData.category ?? ({} as Category),
    slug: initialData.slug ?? "",
    countries: initialData.countries ?? ['uae'],
  })

  const [variants, setVariants] = useState<ProductVariant[]>(
    initialData.variants?.map(variant => ({
      _id: variant._id ?? '',
      sku: variant.sku ?? "",
      color: typeof variant.color === 'object' ? (variant.color as any)?._id : variant.color,
      price: variant.price ?? 0,
      stock: variant.stock ?? 0,
      images: variant.images ?? [],
      stockStatus: variant.stockStatus ?? "in_stock",
      description: variant.description ?? "",
      description_ar: (variant as any).description_ar ?? "",
      description_he: (variant as any).description_he ?? "",
    })) ?? []
  )

  const validateForm = () => {
    const newErrors: FormErrors = {}
    const variantErrors: FormErrors['variantErrors'] = {}

    // Validate basic product info
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required"
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      })
    }
    if (!formData.slug?.trim()) {
      newErrors.slug = "Slug is required"
      toast({
        title: "Validation Error",
        description: "Product slug is required",
        variant: "destructive",
      })
    }
    if (!formData.category?._id) {
      newErrors.category = "Category is required"
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      })
    }

    // Validate variants
    if (variants.length === 0) {
      newErrors.variants = "At least one variant is required"
      toast({
        title: "Validation Error",
        description: "Add at least one product variant",
        variant: "destructive",
      })
    } else {
      variants.forEach((variant, index) => {
        const vErrors: { sku?: string; price?: string; stock?: string; images?: string } = {}

        if (variant.price < 0) {
          vErrors.price = "Valid price is required"
          toast({
            title: "Validation Error",
            description: `Variant ${index + 1}: Price must be greater than or equal to 0`,
            variant: "destructive",
          })
        }
        if (!variant.stock || variant.stock < 0) {
          vErrors.stock = "Valid stock is required"
          toast({
            title: "Validation Error",
            description: `Variant ${index + 1}: Stock must be greater than or equal to 0`,
            variant: "destructive",
          })
        }
        if (!variant.images?.length) {
          vErrors.images = "At least one image URL is required"
          toast({
            title: "Validation Error",
            description: `Variant ${index + 1}: At least one image is required`,
            variant: "destructive",
          })
        }

        if (Object.keys(vErrors).length > 0) {
          variantErrors[index] = vErrors
        }
      })
    }

    if (Object.keys(variantErrors).length > 0) {
      newErrors.variantErrors = variantErrors
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const productData = {
        ...formData,
        image: variants[0]?.images[0] || '',
        variants: variants.map(variant => ({
          _id: variant._id,
          sku: variant.sku,
          color: variant.color,
          price: Number(variant.price),
          stock: Number(variant.stock),
          images: variant.images.map(url => url.trim()).filter(url => url !== ''),
          stockStatus: variant.stockStatus,
          description: variant.description || '',
          description_ar: (variant as any).description_ar || '',
          description_he: (variant as any).description_he || '',
        }))
      }

      try {
        await onSubmit(productData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save product",
          variant: "destructive",
        })
        return;
        // throw new Error("Failed to save product")
      }

    } catch (error: any) {
      console.error("Product save error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addVariant = () => {
    setVariants([...variants, {
      _id: '',
      sku: '',
      color: '',
      price: formData.basePrice || 0,
      stock: 0,
      images: [],
      stockStatus: 'in_stock',
      description: '',
      description_ar: '',
      description_he: '',
    } as any])
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    setVariants(prevVariants => {
      if (index < 0 || index >= prevVariants.length) {
        console.error('Invalid variant index:', index);
        return prevVariants;
      }
      return prevVariants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      );
    });
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleImageUrlsChange = (index: number, value: string) => {
    const urls = value.split('\n');
    updateVariant(index, 'images', urls);
  };

  const handleImageUpload = (index: number, uploadedUrls: string[]) => {
    const currentImages = variants[index].images || [];
    const newImages = [...currentImages, ...uploadedUrls];
    updateVariant(index, 'images', newImages);
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, slug });
  };

  const moveVariant = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= variants.length) return;

    setVariants(prevVariants => {
      const newVariants = [...prevVariants];
      const [movedVariant] = newVariants.splice(fromIndex, 1);
      newVariants.splice(toIndex, 0, movedVariant);
      return newVariants;
    });
  };

  const moveVariantUp = (index: number) => {
    moveVariant(index, index - 1);
  };

  const moveVariantDown = (index: number) => {
    moveVariant(index, index + 1);
  };

  const toggleExpandVariant = (index: number) => {
    setExpandedVariant(current => current === index ? null : index);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Product Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label>Name (English)</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <label>Name (Arabic - اسم بالعربية)</label>
          <Input
            dir="rtl"
            value={formData.name_ar}
            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
            placeholder="اسم المنتج بالعربية"
          />
        </div>
        <div className="space-y-2">
          <label>Name (Hebrew - שם בעברית)</label>
          <Input
            dir="rtl"
            value={formData.name_he}
            onChange={(e) => setFormData({ ...formData, name_he: e.target.value })}
            placeholder="שם המוצר בעברית"
          />
        </div>
        <div className="space-y-2">
          <label>Slug</label>
          <div className="flex gap-2">
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className={errors.slug ? "border-destructive" : ""}
            />
            <Button
              type="button"
              variant="outline"
              onClick={generateSlug}
              title="Generate slug from name"
            >
              <Wand2 className="h-4 w-4" />
            </Button>
          </div>
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug}</p>
          )}
        </div>
        <div className="space-y-2">
          <label>Category</label>
          <Select
            value={formData.category._id}
            onValueChange={(value) => {
              const selectedCategory = categories.find(category => category._id === value);
              setFormData({ ...formData, category: selectedCategory || ({} as Category) });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category}</p>
          )}
        </div>
        <div className="space-y-2">
          <label>Available Countries</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {COUNTRIES.map((country) => (
              <div key={country.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country.id}`}
                  checked={formData.countries.includes(country.id)}
                  onCheckedChange={(checked) => {
                    const newCountries = checked
                      ? [...formData.countries, country.id]
                      : formData.countries.filter(c => c !== country.id);
                    setFormData({ ...formData, countries: newCountries });
                  }}
                />
                <Label htmlFor={`country-${country.id}`}>{country.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Product Variants</h2>
          <Button type="button" onClick={addVariant}>
            <Plus className="mr-2 h-4 w-4" /> Add Variant
          </Button>
        </div>

        {errors.variants && (
          <p className="text-sm text-destructive">{errors.variants}</p>
        )}

        {variants.map((variant, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div
              onClick={() => toggleExpandVariant(index)}
              className="flex justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {expandedVariant === index ?
                  <ChevronDown className="h-4 w-4" /> :
                  <ChevronRight className="h-4 w-4" />
                }
                <h3 className="font-medium">Variant {index + 1}</h3>
                <span className="text-sm text-muted-foreground">
                  {variant.sku && `SKU: ${variant.sku}`}
                  {variant.color && ` · ${(() => {
                    const color = colors.find(c => c._id === variant.color);
                    return color ? `${color.name} (${color.hex})` : 'Color';
                  })()}`}
                  {variant.price > 0 && ` · $${variant.price}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); moveVariantUp(index); }}
                  disabled={index === 0}
                  className="h-8 w-8"
                  title="Move variant up"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); moveVariantDown(index); }}
                  disabled={index === variants.length - 1}
                  className="h-8 w-8"
                  title="Move variant down"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); removeVariant(index); }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {expandedVariant === index && (
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div>
                  <label>SKU</label>
                  <Input
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                    className={errors.variantErrors?.[index]?.sku ? "border-destructive" : ""}
                  />
                  {errors.variantErrors?.[index]?.sku && (
                    <p className="text-sm text-destructive">
                      {errors.variantErrors[index].sku}
                    </p>
                  )}
                </div>

                <div>
                  <label>Color (Optional)</label>
                  <Select
                    value={(typeof variant.color === 'string' ? variant.color : (variant.color as any)?._id) || 'none'}
                    onValueChange={(value) => updateVariant(index, 'color', value === 'none' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No color</SelectItem>
                      {colors.map((color) => (
                        <SelectItem key={color._id} value={color._id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: color.hex }}
                            />
                            {color.name} ({color.hex})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label>Price</label>
                  <Input
                    type="number"
                    step="10"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                    className={errors.variantErrors?.[index]?.price ? "border-destructive" : ""}
                  />
                  {errors.variantErrors?.[index]?.price && (
                    <p className="text-sm text-destructive">
                      {errors.variantErrors[index].price}
                    </p>
                  )}
                </div>

                <div>
                  <label>Stock</label>
                  <Input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                    className={errors.variantErrors?.[index]?.stock ? "border-destructive" : ""}
                  />
                  {errors.variantErrors?.[index]?.stock && (
                    <p className="text-sm text-destructive">
                      {errors.variantErrors[index].stock}
                    </p>
                  )}
                </div>

                <div>
                  <label>Stock Status</label>
                  <Select
                    value={variant.stockStatus}
                    onValueChange={(value) => updateVariant(index, 'stockStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="low_stock">Low Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label>Images</label>
                  <ImageUpload
                    value={variant.images || []}
                    onChange={(urls) => updateVariant(index, 'images', urls)}
                    className="mb-4"
                  />
                  <ImageUrlsManager
                    urls={variant.images || []}
                    onChange={(urls) => updateVariant(index, 'images', urls)}
                    error={errors.variantErrors?.[index]?.images}
                  />
                </div>

                <div className="md:col-span-2">
                  <label>Description (English)</label>
                  <Textarea
                    value={variant.description ?? ''}
                    onChange={(e) => updateVariant(index, 'description', e.target.value)}
                    placeholder="Enter variant description"
                    rows={4}
                  />
                </div>
                <div className="md:col-span-2">
                  <label>Description (Arabic - وصف بالعربية)</label>
                  <Textarea
                    dir="rtl"
                    value={(variant as any).description_ar ?? ''}
                    onChange={(e) => updateVariant(index, 'description_ar' as any, e.target.value)}
                    placeholder="وصف المنتج بالعربية"
                    rows={4}
                  />
                </div>
                <div className="md:col-span-2">
                  <label>Description (Hebrew - תיאור בעברית)</label>
                  <Textarea
                    dir="rtl"
                    value={(variant as any).description_he ?? ''}
                    onChange={(e) => updateVariant(index, 'description_he' as any, e.target.value)}
                    placeholder="תיאור המוצר בעברית"
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Saving..." : "Save Product"}
      </Button>

      {variants.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Add at least one variant to save the product.
        </p>
      )}
    </form>
  )
}