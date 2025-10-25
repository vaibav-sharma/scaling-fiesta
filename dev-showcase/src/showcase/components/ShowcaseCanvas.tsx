'use client'

import { useShowcaseStore } from '@/src/showcase/store/showcaseStore'
import APIFetcher from './APIFetcher'
import ChatUI from './ChatUI'
import MealRecommender from './MealPlanner'
import MovieRecommender from './MoviePlanner'

export default function ShowcaseCanvas() {
  const { activeComponent } = useShowcaseStore()

  const renderComponent = () => {
    switch (activeComponent) {
      case 'api-fetcher':
        return <APIFetcher />
      case 'socket-viewer':
        return <div>🔌 Socket Playground coming soon</div>
      case 'data-table':
        return <div>📊 Data Table component</div>
      case 'retry-tester':
        return <div>⏳ Retry Tester demo</div>
      case 'chat-ui':
        return <ChatUI />
      case 'meal-planner':
        return <MealRecommender />
      case 'movie-planner':
        return <MovieRecommender />
      default:
        return (
          <div className="text-muted-foreground text-center text-lg">
            Select a component from the sidebar or press <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> to open the command palette.
          </div>
        )
    }
  }

  return (
    <div className="flex-1 h-screen overflow-auto p-8 relative bg-background">
      {/* Background grid — sits behind content but above page bg */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(150,150,150,0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Optional fade overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 z-10" />

      {/* Content */}
      <div className="relative z-20 flex justify-center items-center min-h-full">
        {renderComponent()}
      </div>
    </div>
    // <div
    //   className="flex-1 h-screen overflow-auto p-8 relative"
    //   style={{
    //     backgroundImage:
    //       'radial-gradient(circle at 1px 1px, rgba(150,150,150,0.15) 1px, transparent 0)',
    //     backgroundSize: '24px 24px',
    //   }}
    // >
    //   <div className="relative z-10 flex justify-center items-start min-h-full">
    //     {renderComponent()}
    //   </div>

    //   {/* optional fade edges for beauty */}
    //   <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
    // </div>
  )
}