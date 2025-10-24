'use client'

import { SidebarMenuButton, SidebarTrigger, useSidebar } from "@/src/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, Home, HomeIcon, Globe, Unplug, Settings, Table, RefreshCcw, ChartBarIcon, MessageSquareText, Sheet, Palette, Soup, GalleryHorizontalEnd } from "lucide-react"
import ThemeToggle from "@/app/themeToggle"
import { useShowcaseStore } from "../store/showcaseStore"
import ThemeColorToggle from "@/app/themeColorToggle"

export function AppSidebar() {
  const showcaseItems = [
    { id: 'api-fetcher', label: 'API Fetcher', icon: Globe },
    { id: 'socket-viewer', label: 'Socket Playground', icon: Unplug },
    { id: 'data-table', label: 'Data Table', icon: Sheet },
    { id: 'retry-tester', label: 'Retry Tester', icon: RefreshCcw },
    { id: 'chat-ui', label: 'Chat UI', icon: MessageSquareText },
    { id: 'meal-planner', label: 'Meal Planner', icon: Soup },
  ]
  const { activeComponent, setActiveComponent } = useShowcaseStore()
  const { open, toggleSidebar } = useSidebar()


  return (
    // <div className="flex flex-col h-full w-64 border-r border-border bg-card text-foreground">
    <div
      className={`flex flex-col h-full border-r border-border bg-card text-foreground transition-all duration-300 ${open ? "w-64" : "w-0"
        }`}
    >
      {/* Header section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          {/* <GalleryHorizontalEnd /> */}
          <div>
            <h1 className="text-lg font-semibold">Dev Showcase Lab</h1>
            <p className="text-xs text-muted-foreground">by Vaibav Sharma</p>
          </div>
        </div>
        {/* <p className="text-xs text-muted-foreground">by Vaibav Sharma</p> */}
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
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" key="">
        {showcaseItems.map((item) => (
          <a
            key={item.id}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm cursor-pointer"
          >
            <SidebarMenuButton asChild onClick={() => setActiveComponent(item.id)}>
              <p>
                <item.icon />
                <span>{item.label}</span>
              </p>
            </SidebarMenuButton>
          </a>
        ))}
      </nav>

      {/* Footer / Theme toggle */}
      <div className="border-t border-border p-3 flex items-center justify-between">
        <ThemeColorToggle />
        {/* <span className="text-sm text-muted-foreground">Theme</span> */}
        <ThemeToggle />
      </div>
    </div>
  )
}