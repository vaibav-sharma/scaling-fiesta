'use client'

import CommandPalette from '@/src/showcase/components/CommandPalette'
import AnimatedCanvasWrapper from '@/src/showcase/components/AnimatedShowcaseWrapper'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/src/components/ui/sidebar'
import AppSidebar from '@/src/showcase/components/Sidebar'
import { AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

// cast the imported wrapper to any so it accepts children in JSX even if its typing is restrictive
const AnimatedCanvasWrapperAny = AnimatedCanvasWrapper as any

function FloatingSidebarTrigger() {
  const { open } = useSidebar()
  if (open) return null
  return (
    <div className="absolute top-4 left-4 z-20">
      <SidebarTrigger />
    </div>
  )
}

export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <AppSidebar />
        </SidebarContent>
      </Sidebar>

      <FloatingSidebarTrigger />

      <SidebarInset>
        <AnimatePresence mode="wait">
          {/* Wrap subpages in animation container */}
          <AnimatedCanvasWrapperAny>
            {children}
          </AnimatedCanvasWrapperAny>
        </AnimatePresence>

        {/* Command palette should be globally available */}
        <CommandPalette />
      </SidebarInset>
    </SidebarProvider>
  )
}