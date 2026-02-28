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
    size: product?.variants[0]?.size || '',
    color: product?.variants[0]?.color || '',
    caratSize: String(product?.variants[0]?.caratSize || '')
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
    // For the first attribute (size/Gold Colour), show all possible options
    if (attribute === 'size') {
      return getAllOptionsForAttribute(attribute);
    }

    // For subsequent attributes, filter based on selected values
    return product.variants
      .filter(variant => {
        return Object.entries(selectedAttributes).every(([key, value]) => {
          if (key === attribute) return true;
          if (!value) return true; // If no value is selected, don't filter
          return String(variant[key as keyof ProductVariant]) === value;
        });
      })
      .reduce((acc, variant) => {
        const value = variant[attribute as keyof ProductVariant];
        if (value !== undefined && value !== '') {
          acc.add(String(value));
        }
        return acc;
      }, new Set<string>());
  };

  // Updated attribute display names mapping
  const attributeDisplayNames: Record<string, string> = {
    size: 'Gold Colour',
    color: 'Colour',
    caratSize: 'Stones'
  };

  // Define the order of attributes
  const attributeOrder = ['size', 'color', 'caratSize'];

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
        const variantValue = String(variant[key as keyof ProductVariant]);
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

  // Add gold color mapping with lowercase keys
  const goldColorMap: Record<string, string> = {
    'rose': '#B76E79',
    'yellow': '#FFD700',
    'white': '#F5F5F5',
    'rose gold': '#B76E79',
  };

  // Add enamel color mapping with lowercase keys
  const enamelColorMap: Record<string, string> = {
    'lavender': '#93B6FF',
    'sunset': '#FF7900',
    'turquoise': '#28E6FF',
    'cobalt': '#0365D2',
    'coral': '#FC665C',
    'bubblegum': '#FF91B5',
    'candy apple': '#E70000',
    'sena': '#FFD700',

    'emerald': '#50C878',
    'midnight': '#191970',
    'blue': '#0000FF',
    'green': '#008000',
    'pink': '#FFC0CB',
    'yellow': '#FFD700',
    'purple': '#800080',
    'red': '#FF0000',
    'black': '#000000',
    'white': '#FFFFFF',
  };

  // Function to render color previews
  const renderColorPreviews = (value: string, colorMap: Record<string, string>) => {
    // Replace 'and' or 'AND' (case insensitive) with ',' before splitting
    const normalizedValue = value.replace(/\band\b/gi, ',');
    // Split the value by common separators and trim each part
    const colors = normalizedValue.split(/[/,&+-]/).map(color => color.trim()).filter(Boolean);
    
    return colors.map((color, index) => {
      const colorKey = color.toLowerCase();
      return (
        <div 
          key={index}
          className="size-3 rounded-full border"
          style={{ 
            backgroundColor: colorMap[colorKey],
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
          }}
        />
      );
    });
  };

  return (
    <div className="md:container w-full px-2 md:px-6">
      <div className="grid lg:grid-cols-[6rem_minmax(0,1fr)_22rem] lg:gap-6 pb-0">
        {/* Left side - Image Thumbnails (desktop only) */}
        <div className="hidden lg:flex pt-2 flex-col gap-4 sticky self-start top-36 h-[85vh] overflow-y-auto pb-4 pr-2">
          {selectedVariant.images.map((image, index) => (
            <div 
              key={index} 
              className={`cursor-pointer rounded-md overflow-hidden border transition-all ${
                index === selectedImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
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
                className={`cursor-pointer rounded-md overflow-hidden border transition-all flex-shrink-0 w-20 md:w-20 ${
                  index === selectedImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
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
              <p className="mt-2 text-xl text-primary">
                {selectedVariant.price === 0 ? '' :
                  formatPrice(selectedVariant.price)
                }
              </p>
            </div>

            {/* Enhanced Product Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
                {selectedVariant.description}
              </p>
            </div>

            {/* Variant Selection */}
            <div className="space-y-5">
              {attributeOrder.map(attribute => {
                const availableOptions = getAvailableOptions(attribute);
                return availableOptions.size > 0 && (
                  <div key={attribute} className="space-y-4">
                    <Label className="text-sm font-medium">
                      {attributeDisplayNames[attribute]}
                    </Label>
                    <RadioGroup
                      value={selectedAttributes[attribute]}
                      onValueChange={(value) => handleVariantChange(attribute, value)}
                      className="flex flex-wrap gap-2"
                    >
                      {Array.from(availableOptions).map((value) => (
                        <div key={`${attribute}-${value}`}>
                          <RadioGroupItem
                            value={value}
                            id={`${attribute}-${value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`${attribute}-${value}`}
                            className="flex text-sm h-10 items-center justify-center rounded-md border px-4 
                              peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
                              hover:bg-muted cursor-pointer transition-colors gap-2"
                          >
                            {attribute === 'size' && (
                              renderColorPreviews(value, goldColorMap)
                            )}
                            {attribute === 'color' && (
                              renderColorPreviews(value, enamelColorMap)
                            )}
                            {value?.charAt(0)?.toUpperCase() + value?.slice(1)?.toLowerCase() || 'N/A'}
                          </Label>
                        </div>
                      ))}
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