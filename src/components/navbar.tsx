"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { ChevronDownIcon, ChevronUp, Gift, Heart, LogOut, Search, User } from "lucide-react"
import { useWishlist } from "@/contexts/wishlist-context"
import { OurWorldSheet } from "./our-world/our-world-sheet"
import { CartSheet } from "./cart/cart-sheet"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { ContactSheet } from "./contact/contact-sheet"
import { AuthSheet } from "./auth/auth-sheet"
import { SearchSheet } from "./search/search-sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShopSheet } from "./shop/shop-sheet"
import { MovingAd } from "./moving-ad"

export default function Navbar({ lang, dict, categories, products, headerAd }: { lang: string, dict: any, categories: any[], products: any[], headerAd: string }) {
  const { data: session } = useSession()
  const path = usePathname()
  const { state: wishlistState } = useWishlist()
  const [scrolled, setScrolled] = useState(false)
  const [loading, setLoading] = useState(false)

  const isHomePage = path.endsWith(`/${lang}`)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLanguageChange = (newLang: string) => {
    const segments = path.split('/')
    segments[1] = newLang
    window.location.href = segments.join('/')
  }

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
    { code: 'he', label: 'HE' }
  ]

  if (!dict) return null

  const h = dict.header

  return (
    <>
      <header className={`
        sticky top-0 
        w-full 
        z-50 
        transition-all
        duration-300
        bg-white border-b
        ${path.includes('admin') && 'hidden'}
      `}>
        <MovingAd lang={lang} isScrolled={true} isHomePage={false} headerAd={headerAd} />

        <div className={`container mx-auto flex h-12 items-center justify-between px-4 ${path.includes('admin') && 'hidden'}`}>
          {/* Left Links */}
          <div className="flex items-center lg:space-x-6">
            {/* Word-based items (hidden on mobile) */}
            <div className="hidden sm:flex items-center space-x-6">
              <ShopSheet
                categories={categories}
                products={products}
                loading={loading}
                lang={lang}
                label={h.shop}
              />
              <OurWorldSheet lang={lang} label={h.our_world} />
              <SearchSheet
                lang={lang}
                categories={categories}
                products={products}
                label={h.search}
              />
            </div>
            {/* Icon-based items (visible on mobile) */}
            <div className="flex sm:hidden items-center space-x-4">
              <ShopSheet
                categories={categories}
                products={products}
                loading={loading}
                lang={lang}
              />
              <OurWorldSheet lang={lang} />
              <Link href={`/${lang}/group-gift`} className="flex items-center gap-2 hover:cursor-pointer">
                <Gift className="h-5 w-5" />
              </Link>
              <SearchSheet
                lang={lang}
                categories={categories}
                products={products}
              />
            </div>
          </div>

          {/* Right Links */}
          <div className="flex items-center space-x-6">
            {/* Word-based items (hidden on mobile) */}
            <div className="hidden sm:flex items-center space-x-6">
              <ContactSheet label={h.contact} />
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {session.user ? (
                      <span className="flex items-center gap-2 hover:cursor-pointer">
                        <User className="h-5 w-5" />
                        <span>{session.user.name}</span>
                      </span>
                    ) : (
                      <span className="hover:cursor-pointer">{h.my_account}</span>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {session.user.role === "admin" && (
                      <DropdownMenuItem>
                        <Link href={`/admin`} className="w-full">{h.admin}</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Link href={`/${lang}/profile`} className="w-full">{h.profile}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()} className="hover:cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      {h.sign_out}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <AuthSheet label={h.my_account} />
              )}
              <Link href={`/${lang}/wishlist`} className="flex items-center gap-2 hover:cursor-pointer">
                <span>{h.wishlist} ({wishlistState.items.length})</span>
              </Link>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 uppercase font-medium hover:opacity-70 transition-opacity">
                    {lang} <ChevronDownIcon className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((l) => (
                    <DropdownMenuItem key={l.code} onClick={() => handleLanguageChange(l.code)}>
                      {l.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <CartSheet icon />
            </div>
            {/* Icon-based items (visible on mobile) */}
            <div className="flex sm:hidden items-center space-x-2">
              <ContactSheet icon />
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <User className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {session.user.role === "admin" && (
                      <DropdownMenuItem>
                        <Link href="/admin">{h.admin}</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Link href={`/${lang}/profile`}>{h.profile}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {h.sign_out}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <AuthSheet icon />
              )}
              <Link href={`/${lang}/wishlist`} className="relative hover:cursor-pointer">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 text-xs bg-accent text-foreground font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistState.items.length}
                </span>
              </Link>

              {/* Mobile Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 uppercase text-xs font-bold">
                    {lang}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((l) => (
                    <DropdownMenuItem key={l.code} onClick={() => handleLanguageChange(l.code)}>
                      {l.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <CartSheet icon />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="container mx-auto flex items-center justify-center -mt-4 py-4">
          <Link href={`/${lang}`} className="hover:opacity-80 transition-opacity">
            <img className="h-16 w-auto object-contain" src={'/assets/xo-perfumes-logo.png'} alt="XO Perfumes" />
          </Link>
        </div>
      </header>
    </>
  )
}