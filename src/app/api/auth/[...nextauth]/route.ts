import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"

const handler = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise) as any,
})

export { handler as GET, handler as POST } 