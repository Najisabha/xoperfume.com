import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import connectDB from "@/lib/db"
import { User } from "@/lib/models/user"
import { Session } from "@/lib/models/session"

export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {

          await connectDB()
          const user = await User.findOne({ email: credentials.email })
          if (!user) {
            return null
          }

          const isValid = await compare(credentials.password, user.password)

          if (!isValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role // This line ensures role is added to the token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role as string // Explicitly type and assign role
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  events: {
    async signOut({ token }) {
      try {
        await connectDB()
        await Session.findOneAndUpdate(
          { sessionToken: token?.jti },
          { 
            isActive: false,
            revokedAt: new Date()
          }
        )
      } catch (error) {
        console.error("Session revocation error:", error)
      }
    }
  }
}

export type AuthConfig = typeof authConfig