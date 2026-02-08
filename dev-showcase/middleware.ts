export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /login (login page)
     * - /api/auth/* (NextAuth API routes)
     * - /_next/* (Next.js internals)
     * - Static files (images, fonts, etc.)
     */
    '/((?!login|api/auth|_next/static|_next/image|favicon\\.ico|favicon\\.png|robots\\.txt|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$|.*\\.ico$).*)',
  ],
}
