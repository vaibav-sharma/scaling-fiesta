// 'use client'

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
import { AppSidebar } from '@/src/showcase/components/Sidebar'

function FloatingSidebarTrigger() {
  const { state } = useSidebar()
  if (state === 'expanded') return null
  return (
    <div className="absolute top-4 left-4 z-20">
      <SidebarTrigger />
    </div>
  )
}

export default function ShowcasePage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <AppSidebar />
        </SidebarContent>
      </Sidebar>

      <FloatingSidebarTrigger />

      <SidebarInset>
        <AnimatedCanvasWrapper />
        <CommandPalette />
      </SidebarInset>
    </SidebarProvider>
  )
}