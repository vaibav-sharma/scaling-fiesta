"use client"

import { useEffect, useState } from "react"
import { useThemeStore } from "@/src/store/themeStore"
import { Button } from "@/src/components/ui/button"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const { theme, toggleTheme, hydrateTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    hydrateTheme()    // 👈 pull from localStorage and sync DOM classes
    setMounted(true)
  }, [hydrateTheme])

  if (!mounted) return null

  return (
    <Button
      onClick={toggleTheme}
      className="border border-sand/20 bg-primary/10 hover:bg-primary/20 text-softwhite"
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  )
}