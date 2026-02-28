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

export function OurWorldSheet({ lang, label }: { lang: string, label?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <span className="hover:cursor-pointer">{label || 'Our World'}</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-[90%] sm:max-w-lg overflow-hidden bg-white">
        <div className="relative h-full">

          {/* Content */}
          <SheetHeader className="text-left text-lg font-semibold relative z-10">
            {label || 'Our World'}
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