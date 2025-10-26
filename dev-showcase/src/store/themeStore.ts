"use client"
import { create } from "zustand"

type ThemeColor = "ocean" | "sunset" | "blue"
type ThemeMode = "light" | "dark"

interface ThemeState {
  theme: ThemeMode
  toggleTheme: () => void
  color: ThemeColor
  toggleColorScheme: (color: ThemeColor) => void
  hydrateTheme: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark", // neutral SSR-safe default
  color: "ocean",

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark"
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme)
        document.documentElement.classList.toggle("dark", newTheme === "dark")
      }
      return { theme: newTheme }
    }),

  toggleColorScheme: (color) =>
    set(() => {
      if (typeof window !== "undefined") {
        const root = document.documentElement
        root.classList.remove("theme-ocean", "theme-sunset", "theme-blue")
        root.classList.add(`theme-${color}`)
        localStorage.setItem("color", color)
      }
      return { color }
    }),

  // 👇 Called on mount to rehydrate from localStorage
  hydrateTheme: () => {
    if (typeof window === "undefined") return
    const storedTheme = localStorage.getItem("theme") as ThemeMode | null
    const storedColor = localStorage.getItem("color") as ThemeColor | null
    const theme = storedTheme ?? "light"
    const color = storedColor ?? "ocean"

    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.classList.remove("theme-ocean", "theme-sunset", "theme-blue")
    document.documentElement.classList.add(`theme-${color}`)

    set({ theme, color })
  },
}))