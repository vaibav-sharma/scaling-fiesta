'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useSidebar } from '@/src/components/ui/sidebar'
import ShowcaseCanvas from '@/src/showcase/components/ShowcaseCanvas'
import React from 'react'
import { MotionDiv } from '@/src/lib/utils'

export default function AnimatedCanvasWrapper() {
  const { state } = useSidebar()
  const [sidebarWidth, setSidebarWidth] = React.useState(0)
  const sidebarRef = React.useRef<HTMLDivElement | null>(null)

  // Observe sidebar's actual width
  React.useEffect(() => {
    const sidebarEl = document.querySelector('[data-slot="sidebar-container"]') as HTMLDivElement
    if (!sidebarEl) return
    sidebarRef.current = sidebarEl

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSidebarWidth(entry.contentRect.width)
      }
    })
    observer.observe(sidebarEl)
    return () => observer.disconnect()
  }, [])

  return (
    <MotionDiv
      key="canvas"
      className="relative flex-1 overflow-auto p-6 transition-all ease-in-out"
      animate={{
        marginLeft: sidebarWidth,
      }}
      transition={{
        type: 'spring',
        stiffness: 140,
        damping: 22,
      }}
    >
      <AnimatePresence mode="wait">
        <MotionDiv
          key={state}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="h-full flex justify-center items-start"
        >
          <ShowcaseCanvas />
        </MotionDiv>
      </AnimatePresence>
    </MotionDiv>
  )
}