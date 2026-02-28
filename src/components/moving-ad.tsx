"use client"

import Link from "next/link"

interface MovingAdProps {
  isScrolled: boolean
  isHomePage: boolean
  lang: string
  headerAd: string
}

export function MovingAd({ isScrolled, isHomePage, lang, headerAd }: MovingAdProps) {
  // Use headerAd text, fallback to default English if not provided
  const text = headerAd || "A gift today, an heirloom tomorrow"

  return (
    <div
      className={`
        w-full 
        py-2.5
        overflow-hidden
        relative
        ${isScrolled ? 'bg-muted' : 'bg-transparent'}
        ${isHomePage && !isScrolled ? 'text-background' : 'text-foreground'}
      `}
    >
      <div
        className="
          flex
          whitespace-nowrap
          animate-marquee
          hover:pause-animation
          space-x-4
          justify-center
          items-center
          text-sm
          font-medium
        "
      >
        <Link
          href={`/${lang}/shop`}
          className="
              inline-flex 
              items-center 
              gap-2 
              transition-opacity
              px-4
            "
        >
          <span className="text-lg font-semibold tracking-wider uppercase">
            {text}
          </span>
        </Link>
      </div>
    </div>
  )
}
