"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

const WORLD_PAGES = [
  { name: "Our Story", href: "/story" },
  { name: "Our Values", href: "/values" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact us", href: "/contact" },
]

export function OurWorldSheet({ lang }: { lang: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <span className="hover:cursor-pointer">Our World</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-[90%] sm:max-w-lg overflow-hidden bg-white">
        <div className="relative h-full">
          {/* Decorative Images */}
          <div className="absolute left-[-40px] bottom-[30%] w-[180px] h-[180px] opacity-90 rotate-[-15deg]">
            <img
              src="/assets/drawings/ai18.svg"
              alt="Decorative pattern 1"
              width={180}
              height={180}
              className="object-contain"
            />
          </div>
          <div className="absolute right-[0px] top-[60%] w-[200px] h-[200px] opacity-90 rotate-[10deg]">
            <img
              src="/assets/drawings/ai8.svg"
              alt="Decorative pattern 2"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-[-40px] left-[20%] w-[160px] h-[160px] opacity-90 rotate-[5deg]">
            <img
              src="/assets/drawings/ai7.svg"
              alt="Decorative pattern 3"
              width={160}
              height={160}
              className="object-contain"
            />
          </div>

          {/* Content */}
          <SheetHeader className="text-left text-lg font-semibold relative z-10">
            Our World
          </SheetHeader>
          <div className="mt-8 grid gap-4 relative z-10">
            {WORLD_PAGES.map((page) => (
              <Link
                key={page.href}
                href={`/${lang}${page.href}`}
                className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                <span>{page.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}