'use client'
import AnimatedCanvasWrapper from '@/src/showcase/components/AnimatedShowcaseWrapper'
import MealRecommender from '@/src/showcase/components/MealPlanner'

export default function MealPlannerPage() {
  return <MealRecommender />
}


// 'use client'

// import CommandPalette from '@/src/showcase/components/CommandPalette'
// import AnimatedCanvasWrapper from '@/src/showcase/components/AnimatedShowcaseWrapper'
// import {
//   SidebarProvider,
//   Sidebar,
//   SidebarContent,
//   SidebarInset,
//   SidebarTrigger,
//   useSidebar,
// } from '@/src/components/ui/sidebar'
// import { AppSidebar } from '@/src/showcase/components/Sidebar'
// import { AnimatePresence } from 'framer-motion'

// function FloatingSidebarTrigger() {
//   const { state, open } = useSidebar()
//   if (open) return null
//   else return (
//     <div className="absolute top-4 left-4 z-20">
//       <SidebarTrigger />
//     </div>
//   )
// }

// export default function ShowcasePage() {
//   return (
//     <SidebarProvider>
//       <Sidebar>
//         <SidebarContent>
//           <AppSidebar />
//         </SidebarContent>
//       </Sidebar>

//       <FloatingSidebarTrigger />

//       <SidebarInset>
//         <AnimatePresence mode="wait">
//           <AnimatedCanvasWrapper />
//         </AnimatePresence>
//         <CommandPalette />
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }