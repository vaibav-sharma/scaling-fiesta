'use client'

import { useState } from 'react'
import MovieTable from '@/src/showcase/components/MovieTable'
import HistoryTimeline from '@/src/showcase/components/HistoryTimeline'

export default function MovieHistoryPage() {
  const [view, setView] = useState<'classic' | 'timeline'>('classic')

  return (
    <div className="pt-16 overflow-x-hidden">
      {/* ─── Sticky toggle bar ─── */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border px-3 md:px-6 py-2.5 md:py-3">
        <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
          <h2 className="text-base md:text-lg font-bold shrink-0">🎬 Movie History</h2>
          <div className="flex items-center gap-1 md:gap-1.5">
            <button
              onClick={() => setView('classic')}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full border text-xs md:text-sm font-medium transition-all whitespace-nowrap
                ${view === 'classic'
                  ? 'bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white'
                  : 'bg-transparent text-muted-foreground border-border dark:border-white/15 hover:bg-accent dark:hover:bg-white/10 hover:text-foreground'
                }`}
            >
              📋 Classic
            </button>
            <button
              onClick={() => setView('timeline')}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full border text-xs md:text-sm font-medium transition-all whitespace-nowrap
                ${view === 'timeline'
                  ? 'bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white'
                  : 'bg-transparent text-muted-foreground border-border dark:border-white/15 hover:bg-accent dark:hover:bg-white/10 hover:text-foreground'
                }`}
            >
              🕰️ Timeline
            </button>
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      {view === 'classic' ? (
        <div className="p-3 md:p-6">
          <MovieTable />
        </div>
      ) : (
        <div className="min-h-screen bg-background dark:bg-[#0a0a1a] overflow-x-hidden">
          <div className="max-w-5xl mx-auto px-3 md:px-6 py-4 md:py-6">
            <HistoryTimeline filter="movie" />
          </div>
        </div>
      )}
    </div>
  )
}