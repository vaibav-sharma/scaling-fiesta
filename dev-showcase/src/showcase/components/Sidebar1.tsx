'use client'

import { useShowcaseStore } from '@/src/showcase/store/showcaseStore'
import { cn } from '@/src/lib/utils'

const showcaseItems = [
  { id: 'api-fetcher', label: 'API Fetcher' },
  { id: 'socket-viewer', label: 'Socket Playground' },
  { id: 'data-table', label: 'Data Table' },
  { id: 'retry-tester', label: 'Retry Tester' },
  { id: 'chat-ui', label: 'Chat UI' },
]

export default function Sidebar() {
  const { activeComponent, setActiveComponent } = useShowcaseStore()

  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-muted bg-muted/30 h-screen p-4">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      <ul className="space-y-2">
        {showcaseItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveComponent(item.id)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors',
                activeComponent === item.id && 'bg-accent text-accent-foreground'
              )}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}