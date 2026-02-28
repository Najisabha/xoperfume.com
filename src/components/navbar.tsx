"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { Heart, Loader2, LogOut, Search, User, X } from "lucide-react"
import { useWishlist } from "@/contexts/wishlist-context"
import { OurWorldSheet } from "./our-world/our-world-sheet"
import { CartSheet } from "./cart/cart-sheet"
import { usePathname, useRouter } from "next/navigation"
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
import { Product } from "@/types"
import { SearchResponse } from "@/types/search"
import debounce from "lodash/debounce"
import { cn } from "@/lib/utils"

const FLAG_MAP: Record<string, { flag: string; label: string }> = {
  en: { flag: "🇬🇧", label: "English" },
  ar: { flag: "🇸🇦", label: "العربية" },
  he: { flag: "🇮🇱", label: "עברית" },
}

export default function Navbar({ lang, dict, categories, products, headerAd }: { lang: string, dict: any, categories: any[], products: any[], headerAd: string }) {
  const { data: session } = useSession()
  const path = usePathname()
  const router = useRouter()
  const { state: wishlistState } = useWishlist()
  const [loading, setLoading] = useState(false)

  // Inline search state
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleLanguageChange = (newLang: string) => {
    const segments = path.split('/')
    segments[1] = newLang
    window.location.href = segments.join('/')
  }

  const languages = Object.entries(FLAG_MAP)

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (q: string) => {
      if (q.length < 2) { setSearchResults([]); return }
      setSearchLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const data: SearchResponse = await res.json()
        setSearchResults(data.products || [])
      } catch {
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    debouncedSearch(query)
    return () => debouncedSearch.cancel()
  }, [query, debouncedSearch])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const clearSearch = () => {
    setQuery("")
    setSearchResults([])
    inputRef.current?.focus()
  }

  if (!dict) return null

  const h = dict.header
  const currentLang = FLAG_MAP[lang] ?? { flag: "🌐", label: lang.toUpperCase() }
  const isRtl = lang === "ar" || lang === "he"

  return (
    <>
      <header dir={isRtl ? "rtl" : "ltr"} className={`sticky top-0 w-full z-50 bg-white border-b transition-all duration-300 ${path.includes('admin') && 'hidden'}`}>

        {/* Ad Strip */}
        <MovingAd lang={lang} isScrolled={true} isHomePage={false} headerAd={headerAd} />

        {/* Main Nav Row */}
        <div className={`container mx-auto flex h-16 items-center justify-between gap-4 px-4 ${path.includes('admin') && 'hidden'}`}>

          {/* LEFT: Logo */}
          <Link href={`/${lang}`} className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <img
              className="h-10 w-auto object-contain"
              src="/assets/xo-perfumes-logo.png"
              alt="XO Perfumes"
            />
          </Link>

          {/* CENTER: Nav Links + Inline Search (desktop) */}
          <div className="hidden sm:flex items-center gap-5 flex-1 max-w-2xl mx-4">
            {/* Nav links */}
            <nav className="flex items-center gap-5 text-sm font-medium flex-shrink-0">
              <ShopSheet
                categories={categories}
                products={products}
                loading={loading}
                lang={lang}
                label={h.shop}
                dict={dict}
              />
              <OurWorldSheet lang={lang} label={h.our_world} />
              <ContactSheet label={h.contact} dict={dict} />
            </nav>

            {/* Inline Search Input */}
            <div ref={searchRef} className="relative flex-1">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSearchOpen(true) }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder={h.search || "Search…"}
                  className="w-full h-8 px-8 text-sm bg-muted/60 border border-transparent rounded-full focus:outline-none focus:border-border focus:bg-white transition-all placeholder:text-muted-foreground"
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchOpen && query.length >= 2 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white border rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  {searchLoading && (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  {!searchLoading && searchResults.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">No results for &quot;{query}&quot;</p>
                  )}
                  {!searchLoading && searchResults.length > 0 && (
                    <ul className="py-1">
                      {searchResults.map(product => {
                        const productName = lang === 'ar' && product.name_ar ? product.name_ar : lang === 'he' && product.name_he ? product.name_he : product.name;
                        const categoryName = lang === 'ar' && product.category?.name_ar ? product.category.name_ar : lang === 'he' && product.category?.name_he ? product.category.name_he : product.category?.name;
                        return (
                          <li key={product._id}>
                            <Link
                              href={`/${lang}/products/${product.slug}`}
                              onClick={() => { setSearchOpen(false); setQuery("") }}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
                            >
                              <img
                                src={product.image || "/placeholder.png"}
                                alt={productName}
                                className="h-10 w-10 rounded-md object-cover flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-medium line-clamp-1">{productName}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{categoryName}</p>
                              </div>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile: icon-only nav links */}
          <nav className="flex sm:hidden items-center gap-3">
            <ShopSheet
              categories={categories}
              products={products}
              loading={loading}
              lang={lang}
              dict={dict}
            />
            <OurWorldSheet lang={lang} />
            <SearchSheet
              lang={lang}
              categories={categories}
              products={products}
              label={h.search}
            />
          </nav>

          {/* RIGHT: actions + language */}
          <div className="flex items-center gap-5">

            {/* Contact (mobile only — desktop contact is in center nav) */}
            <div className="sm:hidden">
              <ContactSheet icon dict={dict} />
            </div>

            {/* Account */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 hover:opacity-70 transition-opacity focus:outline-none">
                    <User className="h-5 w-5" />
                    <span className="hidden lg:inline text-sm font-medium">{session.user?.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {session.user.role === "admin" && (
                    <DropdownMenuItem>
                      <Link href="/admin" className="w-full">{h.admin}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Link href={`/${lang}/profile`} className="w-full">{h.profile}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="hover:cursor-pointer">
                    <LogOut className="me-2 h-5 w-5" />
                    {h.sign_out}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthSheet icon dict={dict} />
            )}

            {/* Wishlist */}
            <Link href={`/${lang}/wishlist`} className="relative hover:opacity-70 transition-opacity">
              <Heart className="h-5 w-5" />
              {wishlistState.items.length > 0 && (
                <span className="absolute -top-2 -end-2 text-[10px] bg-accent text-foreground font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center leading-none">
                  {wishlistState.items.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <CartSheet icon dict={dict} lang={lang} />

            {/* Language Selector with Flags */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-semibold hover:opacity-70 transition-opacity focus:outline-none select-none">
                  <span className="hidden sm:inline">{currentLang.label}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[100px]">
                {languages.map(([code, { flag, label }]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`flex items-center gap-2 cursor-pointer ${lang === code ? 'font-bold' : ''}`}
                  >
                    <span>{label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </header>
    </>
  )
}