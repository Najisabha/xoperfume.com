"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/toast-provider"
import { FilterProvider } from "@/contexts/filter-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"

interface ProvidersProps {
    children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <CartProvider>
                <WishlistProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem={false}
                    >
                        <FilterProvider>
                            <ToastProvider />
                            {children}
                        </FilterProvider>
                    </ThemeProvider>
                </WishlistProvider>
            </CartProvider>
        </SessionProvider>
    )
}