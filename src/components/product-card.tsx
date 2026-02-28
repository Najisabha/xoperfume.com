import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
// import { useCart } from "@/contexts/cart-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Placeholder } from "@/components/ui/placeholder"
import { useState, useEffect, useRef } from "react"
import { useWishlist } from "@/contexts/wishlist-context"
import { Heart } from "lucide-react"
import { Product } from "@/types"

export function ProductCard({product}: {product: Product}) {
  // const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")

  // Get unique colors from variants
  const uniqueColors = Array.from(
    new Set(
      product.variants
        .map(variant => variant.color)
        .filter(Boolean)
    )
  )

  // Color mapping for display
  const colorMap: Record<string, string> = {
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
    'rose': '#B76E79',
    'rose gold': '#B76E79',
  }

  const allImages = Array.from(
    new Set(
      product.variants.flatMap(variant => variant.images)
    )
  )

  // Use refs to keep track of both timers
  const initialTimerRef = useRef<NodeJS.Timeout | null>(null)
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Add hover handlers
  const handleMouseEnter = () => {
    // Clear any existing timers first
    if (initialTimerRef.current) {
      clearTimeout(initialTimerRef.current)
      initialTimerRef.current = null
    }
    
    if (intervalTimerRef.current) {
      clearInterval(intervalTimerRef.current)
      intervalTimerRef.current = null
    }
    
    if (allImages.length > 1) {
      let relevantImages = allImages;
      
      // If a color is selected, only rotate through images of that color
      if (selectedColor) {
        const colorVariants = product.variants.filter(v => v.color === selectedColor);
        if (colorVariants.length > 0) {
          const colorImages = Array.from(new Set(colorVariants.flatMap(v => v.images)));
          if (colorImages.length > 1) {
            relevantImages = colorImages;
            // Start with the current image
            const currentColorImage = colorImages[0];
            const imageIndex = allImages.findIndex(img => img === currentColorImage);
            if (imageIndex !== -1 && imageIndex !== currentImage) {
              setCurrentImage(imageIndex);
            }
          } else {
            // If only one image for this color, don't do the hover effect
            return;
          }
        }
      }
      
      // First quick transition to second image
      const nextImageIndex = selectedColor 
        ? allImages.findIndex(img => {
            // Find the next image from the same color variant
            const variant = product.variants.find(v => 
              v.color === selectedColor && v.images.includes(allImages[currentImage])
            );
            return variant && variant.images.includes(img) && img !== allImages[currentImage];
          })
        : 1;
        
      if (nextImageIndex > 0) {
        setCurrentImage(nextImageIndex);
      }
      
      // Then start slower transitions
      initialTimerRef.current = setTimeout(() => {
        intervalTimerRef.current = setInterval(() => {
          setCurrentImage(prev => {
            // If color is selected, only cycle through that color's images
            if (selectedColor) {
              const colorVariants = product.variants.filter(v => v.color === selectedColor);
              const colorImages = Array.from(new Set(colorVariants.flatMap(v => v.images)));
              
              if (colorImages.length > 1) {
                const currentImgIndex = colorImages.findIndex(img => img === allImages[prev]);
                const nextIndex = currentImgIndex === -1 || currentImgIndex === colorImages.length - 1 ? 0 : currentImgIndex + 1;
                const globalIndex = allImages.findIndex(img => img === colorImages[nextIndex]);
                return globalIndex !== -1 ? globalIndex : prev;
              }
              return prev;
            } else {
              // Normal cycling through all images
              return prev === allImages.length - 1 ? 0 : prev + 1;
            }
          });
        }, 1000);
      }, 200);
    }
  }

  const handleMouseLeave = () => {
    // Clear both timers
    if (initialTimerRef.current) {
      clearTimeout(initialTimerRef.current)
      initialTimerRef.current = null
    }
    
    if (intervalTimerRef.current) {
      clearInterval(intervalTimerRef.current)
      intervalTimerRef.current = null
    }
    
    // Reset to the appropriate image based on selection
    if (selectedColor) {
      // Find variant with this color and show its first image
      const variant = product.variants.find(v => v.color === selectedColor)
      if (variant && variant.images.length > 0) {
        const imageIndex = allImages.findIndex(img => img === variant.images[0])
        if (imageIndex !== -1) {
          setCurrentImage(imageIndex)
        }
      }
    } else {
      setCurrentImage(0)
    }
  }

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (initialTimerRef.current) {
        clearTimeout(initialTimerRef.current)
      }
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current)
      }
    }
  }, [])

  // Function to handle color selection
  const handleColorSelect = (color: string) => {
    // Clear timers
    if (initialTimerRef.current) {
      clearTimeout(initialTimerRef.current)
      initialTimerRef.current = null
    }
    
    if (intervalTimerRef.current) {
      clearInterval(intervalTimerRef.current)
      intervalTimerRef.current = null
    }

    // If same color is selected again, deselect it
    if (selectedColor === color) {
      setSelectedColor("")
      setCurrentImage(0)
      return
    }

    setSelectedColor(color)
    
    // Find variant with this color and show its first image
    const variant = product.variants.find(v => v.color === color)
    if (variant && variant.images.length > 0) {
      const imageIndex = allImages.findIndex(img => img === variant.images[0])
      if (imageIndex !== -1) {
        setCurrentImage(imageIndex)
      }
    }
  }

  // Function to render color previews
  const renderColorPreview = (color: string) => {
    // Replace 'and' or 'AND' (case insensitive) with ',' before splitting
    const normalizedValue = color.replace(/\band\b/gi, ',');
    // Split the value by common separators and trim each part
    const colors = normalizedValue.split(/[/,&+-]/).map(color => color.trim()).filter(Boolean);
    
    const colorKey = colors[0].toLowerCase();
    return (
      <div 
        className={`size-4 rounded-full border ${selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        style={{ 
          backgroundColor: colorMap[colorKey] || '#ccc',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
        }}
      />
    );
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product._id && isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else if (product._id) {
      addToWishlist(product)
    }
  }
  return (
    <div className="group relative rounded-lg bg-background p-2">
      <button
        onClick={toggleWishlist}
        className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100"
      >
        {product._id && isInWishlist(product._id) ? (
          <Heart className="h-5 w-5 fill-current text-red-500" />
        ) : (
          <Heart className="h-5 w-5" />
        )}
      </button>
      <Link 
        href={`/products/${product.slug}`} 
        className="block overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-square">
          <img
            src={allImages[currentImage]}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover rounded-sm border w-full h-full"
          />
        </div>
      </Link>

      <div className="p-2 text-center">
        <h3 className="mb-1 text-base font-medium">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mb-2 text-sm text-muted-foreground">
          {product.variants[0].price === 0 ? "Available on Request" : formatPrice(product.variants[0].price)}
        </p>
        
        {/* Color selector */}
        {uniqueColors.length > 0 && (
          <div className="flex justify-center gap-2 mt-2">
            {uniqueColors.map((color, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  handleColorSelect(color || '');
                }}
                className="cursor-pointer"
                title={color}
              >
                {renderColorPreview(color || '')}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}