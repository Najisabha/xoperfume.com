"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Layers3,
  Mail,
  Users2,
  Cookie,
  Image,
  Home,
  ChevronLeft,
  ChevronRight,
  Palette,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const menuItems = [
  {
    title: "Home",
    href: "/",
    icon: Home
  },
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Layers3
  },
  {
    title: "Colors",
    href: "/admin/colors",
    icon: Palette
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Contacts",
    href: "/admin/contacts",
    icon: Users,
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users2,
  },
  // {
  //   title: "Sessions",
  //   href: "/admin/sessions",
  //   icon: Cookie,
  // },
  {
    title: "Images",
    href: "/admin/blobs",
    icon: Image,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Cookie, // reusing cookie icon or we could use Settings icon if imported, but Cookie is already imported and not used
  }
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <TooltipProvider>
      <div className={cn(
        "flex h-screen flex-col border-r bg-gray-50/40 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className={cn(
          "flex items-center p-6",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-1.5 hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100",
                      pathname === item.href && "bg-gray-100 text-gray-900",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    {item.title}
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => signOut()}
                className={cn(
                  "flex items-center hover:cursor-pointer space-x-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 w-full",
                  isCollapsed && "justify-center p-0"
                )}
              >
                <LogOut className="size-4" />
                {!isCollapsed && <span>Log out</span>}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Log out
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}