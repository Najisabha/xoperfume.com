"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Product, ProductVariant } from "@/types"
import { AddToCartButton } from "@/components/products/add-to-cart-button"

interface ProductDetailsProps {
  product: Product | null
}

export function ProductDetails({ product }: ProductDetailsProps) {
  // Initialize selectedVariant first
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants[0] || null
  )

  // Initialize selectedAttributes with the first variant's values
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => ({
    color: (typeof product?.variants[0]?.color === 'object'
      ? (product?.variants[0]?.color as any)?._id
      : product?.variants[0]?.color) || ''
  }));

  // Add state for tracking the currently selected image index
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product || !selectedVariant) {
    return (
      <div className="md:container mx-auto w-full h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </div>
    );
  }

  // Get all possible values for an attribute from variants
  const getAllOptionsForAttribute = (attribute: string) => {
    return product.variants.reduce((acc, variant) => {
      const value = variant[attribute as keyof ProductVariant];
      if (value !== undefined && value !== '') {
        acc.add(String(value));
      }
      return acc;
    }, new Set<string>());
  };

  // Get available options for a specific attribute based on currently selected attributes
  const getAvailableOptions = (attribute: string) => {
    return product.variants
      .reduce((acc, variant) => {
        const val = variant[attribute as keyof ProductVariant];
        const value = typeof val === 'object' ? (val as any)?._id : val;
        if (value !== undefined && value !== '') {
          acc.add(String(value));
        }
        return acc;
      }, new Set<string>());
  };

  // Updated attribute display names mapping
  const attributeDisplayNames: Record<string, string> = {
    color: 'Colour',
  };

  // Define the order of attributes
  const attributeOrder = ['color'];

  const handleVariantChange = (attribute: string, value: string) => {
    // Update selected attributes
    const newSelectedAttributes = {
      ...selectedAttributes,
      [attribute]: value
    };

    setSelectedAttributes(newSelectedAttributes);

    // Find matching variant that has all the currently selected attributes
    const newVariant = product.variants.find(variant => {
      // Check if the variant matches all selected attributes
      return Object.entries(newSelectedAttributes).every(([key, selectedValue]) => {
        // Skip if no value is selected for this attribute
        if (!selectedValue) return true;

        // Compare the variant's value with selected value
        const val = variant[key as keyof ProductVariant];
        const variantValue = typeof val === 'object' ? (val as any)?._id : String(val);
        return variantValue === selectedValue;
      });
    });

    // Update the selected variant if found
    if (newVariant) {
      setSelectedVariant(newVariant);
      // Reset selected image index when changing variants
      setSelectedImageIndex(0);
    }
  };

  const countryMap: Record<string, string> = {
    'palastine': 'Palestine',
    'uae': 'UAE',
    'jordan': 'Jordan',
  };

  return (
    <div className="md:container w-full px-2 md:px-6">
      <div className="grid lg:grid-cols-[6rem_minmax(0,1fr)_22rem] lg:gap-6 pb-0">
        {/* Left side - Image Thumbnails (desktop only) */}
        <div className="hidden lg:flex pt-2 flex-col gap-4 sticky self-start top-36 h-[85vh] overflow-y-auto pb-4 pr-2">
          {selectedVariant.images.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer rounded-md overflow-hidden border transition-all ${index === selectedImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                className="w-full aspect-square object-cover"
              />
            </div>
          ))}
        </div>

        {/* Center - Main Image Display */}
        <div className="w-full lg:col-span-1 col-span-full">
          <img
            src={selectedVariant.images[selectedImageIndex]}
            alt={`${product.name}`}
            className=" w-full my-2 mx-auto object-cover object-center rounded-lg"
          />

          {/* Mobile & Tablet thumbnails (horizontal scrolling) */}
          <div className="flex lg:hidden gap-3 mt-4 overflow-x-auto pb-4 px-1">
            {selectedVariant.images.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer rounded-md overflow-hidden border transition-all flex-shrink-0 w-20 md:w-20 ${index === selectedImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                  }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Product Details Panel */}
        <div
          className="mb-20 lg:mb-0 lg:sticky lg:top-36 w-full lg:h-fit bg-background md:px-4 px-2"
        >
          <div className="space-y-4 pt-4 lg:pt-6 pb-6">
            {/* Product Title and Price */}
            <div className="border-b pb-3">
              <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xl text-primary font-semibold">
                  {selectedVariant.price === 0 ? '' : formatPrice(selectedVariant.price)}
                </p>
                {product.countries && product.countries.length > 0 && (
                  <div className="flex gap-1">
                    {product.countries.map(c => (
                      <span key={c} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full uppercase font-bold text-muted-foreground border">
                        {c === 'palastine' ? 'PS' : c.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Product Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
                {selectedVariant.description}
              </p>
            </div>

            {/* Variant Selection */}
            <div className="space-y-6">
              {attributeOrder.map(attribute => {
                const availableOptions = getAvailableOptions(attribute);
                if (availableOptions.size === 0) return null;

                const selectedValue = selectedAttributes[attribute];
                const selectedVariantWithInfo = product.variants.find(v => {
                  const val = v[attribute as keyof ProductVariant];
                  return (typeof val === 'object' ? (val as any)?._id : val) === selectedValue;
                });

                const selectedName = (selectedVariantWithInfo?.color as any)?.name;
                const selectedHex = (selectedVariantWithInfo?.color as any)?.hex;

                return (
                  <div key={attribute} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold tracking-wide uppercase text-gray-900">
                        {attributeDisplayNames[attribute]}
                      </Label>
                      {selectedName && (
                        <span className="text-sm font-medium text-muted-foreground italic">
                          {selectedName} {selectedHex && <span className="ml-1 opacity-70">({selectedHex})</span>}
                        </span>
                      )}
                    </div>
                    <RadioGroup
                      value={selectedValue}
                      onValueChange={(value) => handleVariantChange(attribute, value)}
                      className="flex flex-wrap gap-4"
                    >
                      {Array.from(availableOptions).map((value) => {
                        const variantWithColor = product.variants.find(v => {
                          const val = v[attribute as keyof ProductVariant];
                          return (typeof val === 'object' ? (val as any)?._id : val) === value;
                        });
                        const colorObj = variantWithColor?.color as any;

                        return (
                          <div key={`${attribute}-${value}`}>
                            <RadioGroupItem
                              value={value}
                              id={`${attribute}-${value}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`${attribute}-${value}`}
                              className="relative flex items-center justify-center cursor-pointer transition-all
                                peer-data-[state=checked]:scale-110
                                peer-data-[state=checked]:after:absolute
                                peer-data-[state=checked]:after:inset-[-4px]
                                peer-data-[state=checked]:after:rounded-full
                                peer-data-[state=checked]:after:border-2
                                peer-data-[state=checked]:after:border-primary
                                rounded-full group"
                              title={colorObj?.name}
                            >
                              <div
                                className="size-8 rounded-full border border-gray-200 shadow-sm transition-transform group-hover:scale-105"
                                style={{ backgroundColor: colorObj?.hex || '#ccc' }}
                              />
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                );
              })}
            </div>

            {/* Stock Status */}
            {selectedVariant.stockStatus && (
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${selectedVariant.stockStatus === 'in_stock' ? 'bg-green-500' :
                  selectedVariant.stockStatus === 'low_stock' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                <span className="text-sm font-medium">
                  {selectedVariant.stockStatus.replaceAll('_', ' ').toUpperCase()}
                </span>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="pt-2 pb-12">
              {selectedVariant.price === 0 ? (
                <div className="text-lg font-medium text-gray-700">
                  Price Available on Request
                </div>
              ) : (
                <AddToCartButton
                  product={product}
                  selectedVariant={selectedVariant}
                  disabled={
                    selectedVariant.stockStatus === 'out_of_stock' ||
                    selectedVariant.price === 0
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}