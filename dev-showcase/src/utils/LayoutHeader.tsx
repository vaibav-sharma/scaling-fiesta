// app/LayoutHeader.tsx
'use client'

import Link from "next/link"
import { HomeIcon } from "lucide-react"
import ThemeToggle from "@/src/utils/themeToggle"

export default function LayoutHeader() {
  return (
    <div className="flex justify-between items-center p-4">
      <Link href="/" className="hover:opacity-80">
        <HomeIcon />
      </Link>
      <ThemeToggle />
    </div>
  )
}