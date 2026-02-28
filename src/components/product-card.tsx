import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import { useWishlist } from "@/contexts/wishlist-context"
import { Heart } from "lucide-react"
import { Product, Color } from "@/types"

interface ProductCardProps {
  product: Product
  lang?: string
}

function getLocalizedName(product: Product, lang?: string): string {
  if (lang === 'ar' && product.name_ar) return product.name_ar
  if (lang === 'he' && product.name_he) return product.name_he
  return product.name
}

function getLocalizedColorName(color: Color | string | undefined, lang?: string): string {
  if (!color || typeof color === 'string') return typeof color === 'string' ? color : ''
  if (lang === 'ar' && color.name_ar) return color.name_ar
  if (lang === 'he' && color.name_he) return color.name_he
  return color.name
}

export function ProductCard({ product, lang }: ProductCardProps) {
  // const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")

  // Get unique Color objects from variants (to access translations)
  const uniqueColorObjects = product.variants
    .map(variant => variant.color)
    .filter(Boolean)
    .reduce((acc, color) => {
      const key = typeof color === 'string' ? color : color!.name
      if (!acc.some(c => (typeof c === 'string' ? c : c.name) === key)) {
        acc.push(color!)
      }
      return acc
    }, [] as (string | import('@/types').Color)[])

  // Keep uniqueColors as English names (used as selection keys)
  const uniqueColors = uniqueColorObjects.map(c =>
    typeof c === 'string' ? c : c.name
  )


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
        const colorVariants = product.variants.filter(v => {
          const colorName = typeof v.color === 'string' ? v.color : v.color?.name;
          return colorName === selectedColor;
        });
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
          const variant = product.variants.find(v => {
            const colorName = typeof v.color === 'string' ? v.color : v.color?.name;
            return colorName === selectedColor && v.images.includes(allImages[currentImage]);
          });
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
              const colorVariants = product.variants.filter(v => {
                const colorName = typeof v.color === 'string' ? v.color : v.color?.name;
                return colorName === selectedColor;
              });
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
      const variant = product.variants.find(v => {
        const colorName = typeof v.color === 'string' ? v.color : v.color?.name;
        return colorName === selectedColor;
      })
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
    const variant = product.variants.find(v => {
      const colorName = typeof v.color === 'string' ? v.color : v.color?.name;
      return colorName === color;
    })
    if (variant && variant.images.length > 0) {
      const imageIndex = allImages.findIndex(img => img === variant.images[0])
      if (imageIndex !== -1) {
        setCurrentImage(imageIndex)
      }
    }
  }

  // Function to render color previews
  const renderColorPreview = (colorName: string) => {
    // Find a variant with this color to see if it has a hex code
    const variantWithColor = product.variants.find(v => {
      const name = typeof v.color === 'string' ? v.color : v.color?.name;
      return name === colorName;
    });

    let displayHex = "";
    if (variantWithColor && typeof variantWithColor.color === 'object') {
      displayHex = variantWithColor.color.hex;
    }

    return (
      <div
        className={`size-4 rounded-full border ${selectedColor === colorName ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        style={{
          backgroundColor: displayHex || '#ccc',
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
        href={lang ? `/${lang}/products/${product.slug}` : `/products/${product.slug}`}
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
          <Link href={lang ? `/${lang}/products/${product.slug}` : `/products/${product.slug}`}>{getLocalizedName(product, lang)}</Link>
        </h3>
        <p className="mb-2 text-sm text-muted-foreground">
          {product.variants[0].price === 0 ? "Available on Request" : formatPrice(product.variants[0].price)}
        </p>

        {/* Color selector */}
        {uniqueColors.length > 0 && (
          <div className="flex justify-center gap-2 mt-2">
            {uniqueColorObjects.map((colorObj, index) => {
              const colorKey = typeof colorObj === 'string' ? colorObj : colorObj.name
              const localizedColorName = typeof colorObj === 'string' ? colorObj : getLocalizedColorName(colorObj, lang)
              return (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    handleColorSelect(colorKey || '');
                  }}
                  className="cursor-pointer"
                  title={localizedColorName}
                >
                  {renderColorPreview(colorKey || '')}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}