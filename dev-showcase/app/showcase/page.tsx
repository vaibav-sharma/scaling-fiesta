'use client'

import Sidebar from '@/src/showcase/components/Sidebar'
import ShowcaseCanvas from '@/src/showcase/components/ShowcaseCanvas'
import CommandPalette from '@/src/showcase/components/CommandPalette'

export default function ShowcasePage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <ShowcaseCanvas />
      <CommandPalette />
    </div>
  )
}

// 'use client'

// import { ApiFetcher } from '@/src/showcase/components/ApiFetcher'

// export default function ShowcasePage() {
//   return (
//     <div className="min-h-screen p-8 flex flex-col items-center justify-start bg-background">
//       <h1 className="text-3xl font-semibold mb-4">Developer Showcase</h1>
//       <p className="text-muted-foreground mb-8">
//         Explore live components showcasing API fetches and UI logic.
//       </p>

//       <ApiFetcher />
//     </div>
//   )
// }
