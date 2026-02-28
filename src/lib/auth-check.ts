import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { redirect } from "next/navigation"
import { authConfig } from "./auth.config"

// For API routes
export async function checkAuth(requiredRole?: string) {
  const session = await getServerSession(authConfig)

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  if (requiredRole) {
    // Allow admin access if required role is user
    if (requiredRole === 'user' && session.user.role === 'admin') {
      return null
    }

    if (session.user.role !== requiredRole) {
      return new NextResponse("Forbidden", { status: 403 })
    }
  }

  return null
}

// For server components
export async function authCheck(requiredRole?: string) {
  const session = await getServerSession(authConfig)

  if (!session) {
    redirect("/auth/signin")
  }

  if (requiredRole) {
    // Allow admin access if required role is user
    if (requiredRole === 'user' && session.user.role === 'admin') {
      return
    }

    if (session.user.role !== requiredRole) {
      redirect("/unauthorized")
    }
  }

  return session
}

// Role-based authorization helper
export function hasRole(session: any, role: string) {
  return session?.user?.role === role
}