'use client'

import { HomeIcon } from "lucide-react"
import ThemeToggle from "@/src/utils/themeToggle"

export default function LayoutHeader() {
  const goHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="flex justify-between items-center p-4">
      <button
        onClick={goHome}
        className="hover:opacity-80 cursor-pointer"
        aria-label="Go to home"
      >
        <HomeIcon />
      </button>
      <ThemeToggle />
    </div>
  )
}