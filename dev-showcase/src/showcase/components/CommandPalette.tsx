'use client'

import * as React from 'react'
import { useShowcaseStore } from '@/src/showcase/store/showcaseStore'
import { CommandDialog, CommandGroup, CommandItem, CommandList } from '@/src/components/ui/command'

const items = [
  { id: 'api-fetcher', label: 'API Fetcher' },
  { id: 'socket-viewer', label: 'Socket Playground' },
  { id: 'data-table', label: 'Data Table' },
  { id: 'retry-tester', label: 'Retry Tester' },
  { id: 'chat-ui', label: 'Chat UI' },
]

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const { setActiveComponent } = useShowcaseStore()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandList>
        <CommandGroup heading="Components">
          {items.map((item) => (
            <CommandItem
              key={item.id}
              onSelect={() => {
                setActiveComponent(item.id)
                setOpen(false)
              }}
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}