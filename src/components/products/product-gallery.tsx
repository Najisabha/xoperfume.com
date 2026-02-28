"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)

  if (!images.length) return null

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <img
          src={images[currentImage]}
          alt="Product image"
          className="object-cover"
          // priority
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImage((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white/90"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentImage((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white/90"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-4 overflow-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={img}
              onClick={() => setCurrentImage(idx)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md",
                currentImage === idx ? "ring-2 ring-primary" : "ring-1 ring-border"
              )}
            >
              <img
                src={img}
                alt={`Product view ${idx + 1}`}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}