'use client'

import { SidebarMenuButton, SidebarTrigger, useSidebar } from "@/src/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, Home, HomeIcon, Globe, Unplug, Settings, Table, RefreshCcw, ChartBarIcon } from "lucide-react"
import ThemeToggle from "@/app/themeToggle"
import { useShowcaseStore } from "../store/showcaseStore"

export function AppSidebar() {
  const { toggleSidebar } = useSidebar()
  const showcaseItems = [
    { id: 'api-fetcher', label: 'API Fetcher', icon: Globe },
    { id: 'socket-viewer', label: 'Socket Playground', icon: Unplug },
    { id: 'data-table', label: 'Data Table', icon: Table },
    { id: 'retry-tester', label: 'Retry Tester', icon: RefreshCcw },
    { id: 'chat-ui', label: 'Chat UI', icon: ChartBarIcon },
  ]
    const { activeComponent, setActiveComponent } = useShowcaseStore()
  

  return (
    <div className="flex flex-col h-full w-64 border-r border-border bg-card text-foreground">
      {/* Header section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h1 className="text-lg font-semibold">Dev Showcase Lab</h1>
          <p className="text-xs text-muted-foreground">by Vaibav Sharma</p>
        </div>
        {/* <Button variant="ghost" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button> */}
        {/* <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 z-20"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button> */}
        <div className="absolute top-4 right-4 z-20">
          <SidebarTrigger />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {showcaseItems.map((item) => (
          <a className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm cursor-pointer">
            <SidebarMenuButton asChild onClick={() => setActiveComponent(item.id)}>
              <a href="#">
                <item.icon />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
            {/* <span className="material-symbols-outlined text-base">home</span> */}
            {/* <Home />
            {item.label} */}
          </a>
        ))}
      </nav>

      {/* Footer / Theme toggle */}
      <div className="border-t border-border p-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
    </div>
  )
}