"use client"

import { usePathname } from "next/navigation"
import { APIKeyGuard } from "@/src/components/APIKeyGuard"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isRoot = pathname === "/"

  return (
    <APIKeyGuard>
      <main
        id="main-content"
        className={`flex-1 relative flex justify-center overflow-hidden ${
          isRoot ? "items-center" : ""
        }`}
      >
        {children}
      </main>
    </APIKeyGuard>
  )
}