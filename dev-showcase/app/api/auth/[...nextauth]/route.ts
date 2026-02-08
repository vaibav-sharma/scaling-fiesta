import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

interface CustomToken extends JWT {
  accessToken?: string
  googleId?: string
}

interface CustomSession extends Session {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    id?: string
  }
  accessToken?: string
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  
  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, account, user }: any) {
      // Persist OAuth account to JWT
      if (account) {
        token.accessToken = account.access_token
        token.googleId = account.providerAccountId
      }
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }: { session: CustomSession; token: CustomToken }) {
      // Send JWT to client
      if (session.user) {
        session.user.id = token.googleId
      }
      session.accessToken = token.accessToken
      return session
    },

    async signIn({ user, account, profile }: any) {
      // Fire-and-forget backend notification (don't block sign-in)
      // Backend sync will happen in background
      if (process.env.NEXT_PUBLIC_API_BASE_URL) {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/oauth-callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            googleId: account.providerAccountId,
            picture: user.image,
          }),
          signal: AbortSignal.timeout(3000), // 3 second timeout
        }).catch((error) => {
          console.warn("Backend sync skipped:", error.message)
        })
      }
      
      return true
    },

    async redirect({ url, baseUrl }: any) {
      // Redirect to home after signin
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
