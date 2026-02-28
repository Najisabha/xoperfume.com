import { authConfig } from "@/lib/auth.config"
import { AdminSidebar } from "@/components/admin/sidebar"
import { X } from "lucide-react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import "../globals.css"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing the application",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authConfig)

  if (session?.user.role !== "admin") {
    return <div className="flex justify-center items-center h-[70vh]">
      <X className="w-16 h-16 text-gray-500" />
      <h1 className="text-3xl font-bold text-gray-500">Unauthorized</h1>
    </div>
  }

  return (
    <html>
      <body>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 p-8 pt-20 -mt-6">{children}</main>
        </div>
      </body>
    </html >
  )
}