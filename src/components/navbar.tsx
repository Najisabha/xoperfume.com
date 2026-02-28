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

export default function Navbar({ lang }: { lang: string }) {
  const { data: session } = useSession()
  const path = usePathname()
  const { state: wishlistState } = useWishlist()
  const [scrolled, setScrolled] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  const isHomePage = path.endsWith(`/${lang}`)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products')
        ])
        const [categoriesData, productsData] = await Promise.all([
          categoriesRes.json(),
          productsRes.json()
        ])
        setCategories(categoriesData)
        setProducts(productsData ?? [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
        setProductsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`
        ${isHomePage ? 'fixed' : 'sticky top-0'} 
        w-full 
        z-50 
        transition-all
        duration-300
        ${isHomePage ? (scrolled ? 'bg-white border-b' : 'bg-transparent') : 'bg-white border-b'}
        ${isHomePage && !scrolled && 'text-background'}
        ${path.includes('admin') && 'hidden'}
      `}>
        <MovingAd lang={lang} isScrolled={scrolled} isHomePage={isHomePage} />

        <div className={`container mx-auto flex h-12 items-center justify-between px-4 ${path.includes('admin') && 'hidden'}`}>
          {/* Left Links */}
          <div className="flex items-center lg:space-x-6">
            {/* Word-based items (hidden on mobile) */}
            <div className="hidden sm:flex items-center space-x-6">
              <ShopSheet
                categories={categories}
                products={products}
                loading={loading}
                // productsLoading={productsLoading}
                lang={lang}
              />
              {/* <span className="hover:cursor-pointer">Shop</span> */}
              <OurWorldSheet lang={lang} />
              <SearchSheet
                lang={lang}
                categories={categories}
                products={products}
              />
            </div>
            {/* Icon-based items (visible on mobile) */}
            <div className="flex sm:hidden items-center space-x-4">
              <ShopSheet
                categories={categories}
                products={products}
                loading={loading}
                // productsLoading={productsLoading}
                lang={lang}
              />
              {/* <span className="hover:cursor-pointer">Shop</span> */}
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
              <ContactSheet />
              {/* <span className="hover:cursor-pointer">My Account</span> */}
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {session.user ? (
                      <span className="flex items-center gap-2 hover:cursor-pointer">
                        <User className="h-5 w-5" />
                        <span>{session.user.name}</span>
                      </span>
                    ) : (
                      <span className="hover:cursor-pointer">My Account</span>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {session.user.role === "admin" && (
                      <DropdownMenuItem>
                        <Link href={`/admin`} className="w-full">Admin</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Link href={`/${lang}/profile`} className="w-full">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()} className="hover:cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <AuthSheet />
              )}
              <Link href={`/${lang}/wishlist`} className="flex items-center gap-2 hover:cursor-pointer">
                <span>Wishlist ({wishlistState.items.length})</span>
              </Link>
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
                        <Link href="/admin">Admin</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Link href={`/${lang}/profile`}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <AuthSheet icon />
              )}
              {/* <span className="hover:cursor-pointer"> My Account</span> */}
              <Link href={`/${lang}/wishlist`} className="relative hover:cursor-pointer">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 text-xs bg-accent text-foreground font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistState.items.length}
                </span>
              </Link>
              <CartSheet icon />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="container mx-auto flex h-20 -mt-6 items-center justify-center px-4">
          <Link href={`/${lang}`} className="text-3xl font-bold h-12 -mb-4">
            {(!scrolled && isHomePage) ?
              <>
                <img className="h-20 object-cover hover:cursor-pointer" src={'/assets/grace-white.png'} width={500} height={100} alt="XO Perfumes" />
              </>
              :
              <>
                <img className="h-20 object-cover hover:cursor-pointer" src={'/assets/grace.svg'} width={500} height={100} alt="XO Perfumes" />
              </>
            }
          </Link>
        </div>
      </header>
    </>
  )
}