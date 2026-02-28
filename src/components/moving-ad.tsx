"use client"

import Link from "next/link"

interface MovingAdProps {
  isScrolled: boolean
  isHomePage: boolean
  lang: string
  headerAd: string
}

export function MovingAd({ isScrolled, isHomePage, lang, headerAd }: MovingAdProps) {
  const text = headerAd || "A gift today, an heirloom tomorrow"

  return (
    <div
      className={`
        w-full
        py-1.5
        overflow-hidden
        relative
        ${isScrolled ? 'bg-muted' : 'bg-transparent'}
        ${isHomePage && !isScrolled ? 'text-background' : 'text-foreground'}
      `}
    >
      <div className="flex justify-center items-center">
        <Link
          href={`/${lang}/shop`}
          className="
            inline-flex
            items-center
            gap-2
            transition-opacity
            hover:opacity-70
            max-w-[50%]
            px-4
          "
        >
          <span className="text-xs font-medium tracking-widest uppercase whitespace-nowrap overflow-hidden text-ellipsis">
            {text}
          </span>
        </Link>
      </div>
    </div>
  )
}
