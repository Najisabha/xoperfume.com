"use client"

import Link from "next/link"
import CustomText from "./custom-text"
import Image from "next/image"

interface MovingAdProps {
  isScrolled: boolean
  isHomePage: boolean
  lang: string
}

export function MovingAd({ isScrolled, isHomePage, lang }: MovingAdProps) {
  return (
    <div
      className={`
        w-full 
        py-2.5
        overflow-hidden
        relative
        ${isScrolled ? 'bg-white' : 'bg-transparent'}
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
          <img
            src={`/assets/header-sentence2.svg`}
            width={650}
            height={80}
            alt="a gift today, an heirloom tomorrow"
            className="-mb-2 z-50"
          />
          {/* <CustomText
              text="  A gift today, an heirloom tomorrow  "
              letterSpacing={0.05}
              size={20}
            /> */}
        </Link>
      </div>
    </div>
  )
}
