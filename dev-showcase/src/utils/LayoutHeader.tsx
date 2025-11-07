'use client'

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HomeIcon, HistoryIcon, RocketIcon } from "lucide-react"
import ThemeToggle from "@/src/utils/themeToggle"
import { motion, AnimatePresence } from "framer-motion"


export default function LayoutHeader() {
  const router = useRouter()
  const pathname = usePathname()

  const routes = {
    home: "/",
    mealhistory: "/mealhistory",
    moviehistory: "/moviehistory",
    meal: "/mealplanner",
    movie: "/movieplanner"
  }

  const isMealPlanner = pathname.startsWith(routes.meal)
  const isMoviePlanner = pathname.startsWith(routes.movie)
  const isMealHistory = pathname.startsWith(routes.mealhistory)
  const isMovieHistory = pathname.startsWith(routes.moviehistory)
  const isHome = pathname === routes.home

  // const target = () => {

  // }



  const toggleRoute = () => {
    if(isMealHistory || isMovieHistory) window.history.back()
    else if(isMealPlanner) window.location.href = routes.mealhistory
    else if(isMoviePlanner) window.location.href = routes.moviehistory
    else window.location.href = routes.home
  }

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        flex justify-between items-center 
        px-5 py-3
        border-b border-border/40
        bg-background/60
        backdrop-blur-xl backdrop-saturate-150
        supports-[backdrop-filter]:bg-background/60
        transition-colors
        shadow-[0_1px_10px_-2px_rgba(0,0,0,0.1)]
      "
    >
      {/* Home */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Go home"
        onClick={() => window.location.href = routes.home}
        className="hover:bg-primary/10"
      >
        <HomeIcon className="w-5 h-5 text-foreground" />
      </Button>

      {/* Frosted Smart Toggle */}
      {!isHome && <Button
        onClick={toggleRoute}
        variant="outline"
        className="
          relative w-32 overflow-hidden 
          flex justify-center items-center
          rounded-xl 
          bg-card/50 backdrop-blur-md
          border border-border/30
          hover:bg-accent/30 hover:border-border/50
          transition-all
        "
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={isMealHistory || isMovieHistory ? 'back' : 'history'}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute flex items-center gap-2 text-sm"
          >
            {isMealHistory || isMovieHistory ? (
              <>
                <RocketIcon className="w-4 h-4" />
                Back
              </>
            ) : (
              <>
                <HistoryIcon className="w-4 h-4" />
                History
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </Button>}

      {/* Theme Toggle */}
      <ThemeToggle />
    </header>
  )
}