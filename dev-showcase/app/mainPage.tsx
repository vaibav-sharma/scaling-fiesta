"use client"

import { usePathname } from "next/navigation"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isRoot = pathname === "/"

  return (
    <main
      id="main-content"
      className={`flex-1 relative flex justify-center overflow-visible ${
        isRoot ? "items-center" : ""
      }`}
    >
      {children}
    </main>
  )
}