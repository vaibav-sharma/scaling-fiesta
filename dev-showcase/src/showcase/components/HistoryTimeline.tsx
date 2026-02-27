'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { getAllMeals, deleteMeal, MealEntry } from '@/src/utils/mealDB'
import { getAllMovies, MovieEntry } from '@/src/utils/movieDB'
import { Trash2, ChevronRight, RefreshCw, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Types ─── */
type TimelineItem = {
  id: number | string
  type: 'meal' | 'movie'
  timestamp: number
  data: any
}

/* ─── Date helpers ─── */
function formatDateGroup(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff = (today.getTime() - target.getTime()) / 86400000
  if (diff === 0) return `Today — ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  if (diff === 1) return `Yesterday — ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function dateKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function groupByDate(items: TimelineItem[]) {
  const map = new Map<string, TimelineItem[]>()
  const labels = new Map<string, string>()
  for (const item of items) {
    const key = dateKey(item.timestamp)
    if (!map.has(key)) { map.set(key, []); labels.set(key, formatDateGroup(item.timestamp)) }
    map.get(key)!.push(item)
  }
  return Array.from(map.entries()).map(([key, items]) => ({
    date: key,
    dateLabel: labels.get(key)!,
    items: items.sort((a, b) => b.timestamp - a.timestamp),
  }))
}

/* ═══════════════════════════════════════
   SCOPED STYLES  (matches mock CSS vars)
   ═══════════════════════════════════════ */
const scopedStyles = `
  /* ── LIGHT MODE (default) ── */
  .htl-root {
    --bg: #ffffff;
    --surface: rgba(0,0,0,0.03);
    --surface-hover: rgba(0,0,0,0.06);
    --surface-active: rgba(0,0,0,0.1);
    --border: rgba(0,0,0,0.1);
    --border-strong: rgba(0,0,0,0.18);
    --text: #18181b;
    --text-muted: #71717a;
    --text-dim: #a1a1aa;
    --accent-meal: #16a34a;
    --accent-meal-bg: rgba(22,163,74,0.1);
    --accent-movie: #4f46e5;
    --accent-movie-bg: rgba(79,70,229,0.1);
    --accent-orange: #ea580c;
    --radius: 14px;
    --radius-sm: 10px;
    color: var(--text);
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  .htl-root *, .htl-root *::before, .htl-root *::after {
    box-sizing: border-box;
  }
  /* ── DARK MODE ── */
  .dark .htl-root {
    --bg: #0a0a1a;
    --surface: rgba(255,255,255,0.05);
    --surface-hover: rgba(255,255,255,0.08);
    --surface-active: rgba(255,255,255,0.12);
    --border: rgba(255,255,255,0.1);
    --border-strong: rgba(255,255,255,0.18);
    --text: #e4e4e7;
    --text-muted: #71717a;
    --text-dim: #52525b;
    --accent-meal: #22c55e;
    --accent-meal-bg: rgba(34,197,94,0.12);
    --accent-movie: #6366f1;
    --accent-movie-bg: rgba(99,102,241,0.12);
    --accent-orange: #f97316;
  }

  /* ── STAT CARDS ── */
  .htl-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 28px;
  }
  @media (max-width: 900px) {
    .htl-stats { grid-template-columns: repeat(4, 1fr); gap: 8px; }
  }
  @media (max-width: 640px) {
    .htl-stats { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  }
  @media (max-width: 380px) {
    .htl-stats { grid-template-columns: 1fr; gap: 6px; }
  }
  .htl-stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px 18px;
    backdrop-filter: blur(16px);
    transition: all 0.2s;
    min-width: 0;
    overflow: hidden;
  }
  .htl-stat:hover { background: var(--surface-hover); transform: translateY(-1px); }
  .htl-stat-label {
    font-size: 0.68rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .htl-stat-value {
    font-size: 1.6rem;
    font-weight: 700;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .htl-stat-sub {
    font-size: 0.75rem;
    color: var(--text-dim);
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── HEATMAP ── */
  .htl-heatmap { margin-bottom: 32px; overflow: hidden; }
  .htl-hm-header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 10px; }
  .htl-hm-header h3 { font-size: 0.9rem; font-weight: 600; color: var(--text-muted); margin: 0; }
  .htl-hm-header span { font-size: 0.7rem; color: var(--text-dim); }
  .htl-hm-scroll {
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 8px;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }
  .htl-hm-inner {
    width: max-content;
    min-width: 100%;
  }
  .htl-hm-wrap { display: flex; gap: 10px; align-items: flex-start; }
  .htl-hm-months { display: flex; margin-bottom: 4px; padding-left: 26px; }
  .htl-hm-months span { flex-shrink: 0; font-size: 0.6rem; color: var(--text-dim); text-align: center; }
  .htl-hm-days { display: flex; flex-direction: column; gap: 2px; padding-right: 4px; flex-shrink: 0; }
  .htl-hm-days span { height: 11px; font-size: 0.55rem; color: var(--text-dim); display: flex; align-items: center; line-height: 1; }
  .htl-hm-grid { display: flex; gap: 2px; }
  .htl-hm-col { display: flex; flex-direction: column; gap: 2px; }
  .htl-hm-cell {
    width: 11px; height: 11px; border-radius: 2px;
    background: var(--surface);
    transition: all 0.12s;
    cursor: crosshair;
    position: relative;
  }
  .htl-hm-cell:hover { transform: scale(1.6); z-index: 2; }
  .htl-hm-cell.l1 { background: rgba(22,163,74,0.2); }
  .htl-hm-cell.l2 { background: rgba(22,163,74,0.4); }
  .htl-hm-cell.l3 { background: rgba(22,163,74,0.6); }
  .htl-hm-cell.l4 { background: rgba(22,163,74,0.85); }
  .dark .htl-hm-cell.l1 { background: rgba(34,197,94,0.18); }
  .dark .htl-hm-cell.l2 { background: rgba(34,197,94,0.35); }
  .dark .htl-hm-cell.l3 { background: rgba(34,197,94,0.55); }
  .dark .htl-hm-cell.l4 { background: rgba(34,197,94,0.8); }
  .htl-hm-cell[data-tip]:hover::after {
    content: attr(data-tip);
    position: absolute; bottom: calc(100% + 6px); left: 50%;
    transform: translateX(-50%); white-space: nowrap;
    font-size: 0.65rem; padding: 4px 8px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 6px; color: var(--text);
    pointer-events: none; z-index: 10;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  .htl-hm-legend { display: flex; gap: 3px; margin-top: 8px; align-items: center; }
  .htl-hm-legend span { font-size: 0.6rem; color: var(--text-dim); }
  .htl-hm-legend .htl-hm-cell { cursor: default; }
  .htl-hm-legend .htl-hm-cell:hover { transform: none; }

  /* ── FILTER BAR ── */
  .htl-filters { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px; align-items: center; }
  .htl-filter-btn {
    padding: 6px 16px; border-radius: 999px; border: 1px solid var(--border);
    background: transparent; color: var(--text-muted);
    font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
    font-family: inherit;
  }
  .htl-filter-btn:hover { background: var(--surface); color: var(--text); }
  .htl-filter-btn.active { background: var(--surface-active); color: var(--text); border-color: var(--border-strong); }

  .htl-refresh-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--surface);
    color: var(--text-muted); font-size: 0.75rem;
    cursor: pointer; transition: all 0.2s; font-family: inherit;
    margin-left: auto;
  }
  .htl-refresh-btn:hover { background: var(--surface-hover); color: var(--text); }
  .htl-data-note { font-size: 0.68rem; color: var(--text-dim); }

  /* ── TIMELINE LINE ── */
  .htl-timeline { position: relative; padding-left: 36px; }
  .htl-timeline::before {
    content: '';
    position: absolute; left: 13px; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, var(--accent-meal) 0%, var(--accent-movie) 50%, var(--accent-meal) 100%);
    border-radius: 2px; opacity: 0.2;
  }
  @media (max-width: 640px) {
    .htl-timeline { padding-left: 26px; }
    .htl-timeline::before { left: 9px; }
  }

  /* ── DATE GROUP ── */
  .htl-group { margin-bottom: 28px; }
  .htl-date {
    position: relative;
    font-size: 0.78rem; font-weight: 600;
    color: var(--text-muted); margin-bottom: 12px;
    padding: 2px 0; display: flex; align-items: center; gap: 6px;
  }
  .htl-date::before {
    content: '';
    position: absolute; left: -29px; top: 50%; transform: translateY(-50%);
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--accent-meal);
    border: 2px solid var(--bg);
    box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
  }
  @media (max-width: 640px) {
    .htl-date::before { left: -21px; width: 8px; height: 8px; }
  }
  .htl-date .htl-count { font-weight: 400; color: var(--text-dim); font-size: 0.7rem; }

  /* ── TIMELINE CARD ── */
  .htl-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden;
    position: relative;
  }
  .htl-card::before {
    content: '';
    position: absolute; top: 0; left: 0; bottom: 0;
    width: 3px;
    border-radius: 3px 0 0 3px;
  }
  .htl-card.meal::before { background: var(--accent-meal); }
  .htl-card.movie::before { background: var(--accent-movie); }
  .htl-card:hover, .htl-card.expanded {
    background: var(--surface-hover);
    border-color: var(--border-strong);
  }
  .htl-card-header {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 14px 16px;
  }
  .htl-card-icon {
    width: 36px; height: 36px;
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; flex-shrink: 0;
  }
  .htl-card.meal .htl-card-icon { background: var(--accent-meal-bg); }
  .htl-card.movie .htl-card-icon { background: var(--accent-movie-bg); }
  .htl-card-body { flex: 1; min-width: 0; }
  .htl-card-title { font-size: 0.95rem; font-weight: 600; line-height: 1.3; color: var(--text); }
  .htl-card-meta { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
  .htl-card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .htl-tag {
    font-size: 0.68rem; padding: 3px 9px;
    border-radius: 7px;
    background: var(--surface);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .htl-card-time { font-size: 0.68rem; color: var(--text-dim); flex-shrink: 0; padding-top: 2px; }
  @media (max-width: 640px) { .htl-card-time { display: none; } }
  .htl-card-chevron {
    flex-shrink: 0; margin-top: 4px;
    transition: transform 0.2s; color: var(--text-dim);
  }
  .htl-card-chevron.open { transform: rotate(90deg); }

  /* ── TABLET ADJUSTMENTS (641px - 900px) ── */
  @media (max-width: 900px) {
    .htl-stat { padding: 14px 14px; }
    .htl-stat-value { font-size: 1.35rem; }
    .htl-card-header { padding: 12px 14px; }
  }

  /* ── MOBILE TOUCH TARGETS & COMPACT ── */
  @media (max-width: 640px) {
    .htl-root { padding: 0; }
    .htl-filter-btn { padding: 8px 14px; font-size: 0.78rem; min-height: 40px; }
    .htl-action-btn { padding: 10px 16px; font-size: 0.78rem; min-height: 44px; }
    .htl-refresh-btn { padding: 8px 12px; min-height: 40px; font-size: 0.7rem; }
    .htl-card-header { padding: 12px 10px; gap: 8px; }
    .htl-card-icon { width: 32px; height: 32px; font-size: 1rem; }
    .htl-card-title { font-size: 0.88rem; }
    .htl-card-tags { gap: 4px; margin-top: 6px; }
    .htl-tag { font-size: 0.62rem; padding: 2px 7px; }
    .htl-stat { padding: 12px 10px; }
    .htl-stat-value { font-size: 1.3rem; }
    .htl-stat-label { font-size: 0.6rem; }
    .htl-stats { gap: 6px; margin-bottom: 20px; }
    .htl-filters { gap: 4px; margin-bottom: 16px; }
    .htl-detail { padding: 10px 10px 14px; }
    .htl-detail-grid { gap: 8px 12px; }
    .htl-hm-months { padding-left: 22px; }
    .htl-hm-days span { font-size: 0.5rem; }
    .htl-hm-cell { width: 10px; height: 10px; }
    .htl-hm-grid { gap: 1.5px; }
    .htl-hm-col { gap: 1.5px; }
  }

  /* ── VERY SMALL SCREENS ── */
  @media (max-width: 380px) {
    .htl-stat-value { font-size: 1.15rem; }
    .htl-card-title { font-size: 0.82rem; }
    .htl-card-meta { font-size: 0.7rem; }
    .htl-tag { font-size: 0.58rem; padding: 2px 5px; }
    .htl-timeline { padding-left: 22px; }
    .htl-timeline::before { left: 7px; }
    .htl-date::before { left: -18px; width: 7px; height: 7px; }
  }

  /* ── CARD DETAIL ── */
  .htl-detail { padding: 12px 16px 16px; border-top: 1px solid var(--border); }
  .htl-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; }
  @media (max-width: 640px) { .htl-detail-grid { grid-template-columns: 1fr; } }
  .htl-detail-field {}
  .htl-detail-label {
    font-size: 0.65rem; color: var(--text-dim);
    text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600;
  }
  .htl-detail-value { font-size: 0.85rem; color: var(--text); margin-top: 1px; }
  .htl-detail-note {
    grid-column: 1 / -1;
    margin-top: 8px; padding: 12px;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;
  }
  .htl-detail-note strong { color: var(--text); font-weight: 600; }
  .htl-detail-note.movie-comment {
    background: rgba(79,70,229,0.06);
    border-color: rgba(79,70,229,0.12);
  }
  .dark .htl-detail-note.movie-comment {
    background: rgba(99,102,241,0.06);
    border-color: rgba(99,102,241,0.12);
  }
  .htl-alternatives { grid-column: 1 / -1; margin-top: 4px; }
  .htl-alternatives h5 { font-size: 0.72rem; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; }
  .htl-alt-item {
    font-size: 0.82rem; padding: 6px 0;
    border-bottom: 1px solid var(--border);
  }
  .htl-alt-item:last-child { border-bottom: 0; }
  .htl-alt-title { color: var(--text); font-weight: 500; }
  .htl-alt-note { color: var(--text-muted); }

  /* ── ACTIONS ── */
  .htl-actions {
    display: flex; gap: 8px; margin-top: 12px; padding-top: 12px;
    border-top: 1px solid var(--border);
  }
  .htl-action-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--surface);
    color: var(--text-muted); font-size: 0.75rem;
    cursor: pointer; transition: all 0.2s; font-family: inherit;
  }
  .htl-action-btn:hover { background: var(--surface-hover); color: var(--text); }
  .htl-action-btn.danger { border-color: rgba(239,68,68,0.25); color: #ef4444; }
  .htl-action-btn.danger:hover { background: rgba(239,68,68,0.1); }

  /* ── SKELETON ── */
  @keyframes htl-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.15; } }
  .htl-skeleton { border-radius: 8px; background: var(--surface-active); animation: htl-pulse 1.8s ease-in-out infinite; }

  /* ── EMPTY ── */
  .htl-empty { text-align: center; padding: 64px 20px; color: var(--text-dim); }
  .htl-empty-icon { font-size: 3rem; margin-bottom: 12px; opacity: 0.4; }
  .htl-empty p { font-size: 0.85rem; }
  .htl-empty .htl-empty-sub { font-size: 0.75rem; color: var(--text-dim); margin-top: 4px; }
`

/* ═══════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════ */

function StatsRow({ meals, movies }: { meals: MealEntry[]; movies: MovieEntry[] }) {
  const total = meals.length + movies.length

  const streak = useMemo(() => {
    if (total === 0) return 0
    const dates = new Set([...meals.map(m => m.timestamp), ...movies.map(m => m.timestamp)].map(ts => dateKey(ts)))
    let count = 0
    const now = new Date()
    for (let i = 0; i <= 365; i++) {
      const d = new Date(now); d.setDate(d.getDate() - i)
      if (dates.has(dateKey(d.getTime()))) count++
      else if (i > 0) break
    }
    return count
  }, [meals, movies, total])

  const topDiet = useMemo(() => {
    const counts = new Map<string, number>()
    meals.forEach(m => { const dt = m.data?.dietType; if (dt) counts.set(dt, (counts.get(dt) || 0) + 1) })
    let top = '—', max = 0
    counts.forEach((v, k) => { if (v > max) { top = k; max = v } })
    return { name: top, count: max }
  }, [meals])

  return (
    <div className="htl-stats">
      <div className="htl-stat">
        <div className="htl-stat-label">Meals Planned</div>
        <div className="htl-stat-value" style={{ color: 'var(--accent-meal)' }}>{meals.length}</div>
        <div className="htl-stat-sub">{total > 0 ? `of ${total} total` : 'none yet'}</div>
      </div>
      <div className="htl-stat">
        <div className="htl-stat-label">Movies Picked</div>
        <div className="htl-stat-value" style={{ color: 'var(--accent-movie)' }}>{movies.length}</div>
        <div className="htl-stat-sub">{total > 0 ? `of ${total} total` : 'none yet'}</div>
      </div>
      <div className="htl-stat">
        <div className="htl-stat-label">Current Streak</div>
        <div className="htl-stat-value" style={{ color: 'var(--accent-orange)' }}>🔥 {streak}</div>
        <div className="htl-stat-sub">days in a row</div>
      </div>
      <div className="htl-stat">
        <div className="htl-stat-label">Top Diet</div>
        <div className="htl-stat-value" style={{ fontSize: '1.15rem', color: 'var(--text)' }}>{topDiet.name}</div>
        <div className="htl-stat-sub">{topDiet.count > 0 ? `${topDiet.count} of ${meals.length} meals` : ''}</div>
      </div>
    </div>
  )
}

function Heatmap({ items }: { items: TimelineItem[] }) {
  const { weeks, monthLabels, total } = useMemo(() => {
    const counts = new Map<string, number>()
    items.forEach(item => {
      const d = new Date(item.timestamp)
      counts.set(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`, (counts.get(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`) || 0) + 1)
    })
    const today = new Date()
    const weeks: { cells: { date: Date; count: number }[] }[] = []
    const start = new Date(today)
    start.setDate(start.getDate() - (52 * 7) + (7 - start.getDay()))
    let currentMonth = -1
    const monthLabels: { label: string; weekIdx: number }[] = []
    for (let w = 0; w < 52; w++) {
      const cells: { date: Date; count: number }[] = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(start); date.setDate(start.getDate() + w * 7 + d)
        const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        cells.push({ date, count: counts.get(key) || 0 })
        if (d === 0 && date.getMonth() !== currentMonth) {
          currentMonth = date.getMonth()
          monthLabels.push({ label: date.toLocaleDateString('en-US', { month: 'short' }), weekIdx: w })
        }
      }
      weeks.push({ cells })
    }
    return { weeks, monthLabels, total: items.length }
  }, [items])

  const levelCls = (c: number) => c === 0 ? '' : c === 1 ? 'l1' : c === 2 ? 'l2' : c <= 4 ? 'l3' : 'l4'

  return (
    <div className="htl-heatmap">
      <div className="htl-hm-header">
        <h3>Activity</h3>
        <span>{total} items in the last year</span>
      </div>
      <div className="htl-hm-scroll">
        <div className="htl-hm-inner">
          <div className="htl-hm-months">
            {monthLabels.map((m, i) => {
              const span = (monthLabels[i + 1]?.weekIdx ?? 52) - m.weekIdx
              return <span key={i} style={{ width: `${span * 13}px` }}>{m.label}</span>
            })}
          </div>
          <div className="htl-hm-wrap">
            <div className="htl-hm-days">
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((l, i) => <span key={i}>{l}</span>)}
            </div>
            <div className="htl-hm-grid">
              {weeks.map((week, wi) => (
                <div key={wi} className="htl-hm-col">
                  {week.cells.map((cell, di) => (
                    <div
                      key={di}
                      className={`htl-hm-cell ${levelCls(cell.count)}`}
                      data-tip={`${cell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${cell.count === 0 ? 'No activity' : `${cell.count} item${cell.count > 1 ? 's' : ''}`}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="htl-hm-legend">
        <span>Less</span>
        <div className="htl-hm-cell" />
        <div className="htl-hm-cell l1" />
        <div className="htl-hm-cell l2" />
        <div className="htl-hm-cell l3" />
        <div className="htl-hm-cell l4" />
        <span>More</span>
      </div>
    </div>
  )
}

function DetailField({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="htl-detail-field">
      <div className="htl-detail-label">{label}</div>
      <div className="htl-detail-value">{value}</div>
    </div>
  )
}

function MealDetail({ data }: { data: any }) {
  return (
    <div className="htl-detail-grid">
      <DetailField label="Bread / Base" value={data.base} />
      <DetailField label="Pulses / Proteins" value={data.pulses} />
      <DetailField label="Main Dish" value={data.mains} />
      <DetailField label="Sides / Add-ons" value={data.sides} />
      <DetailField label="Beverage" value={data.beverage} />
      {data.instructions && <DetailField label="Instructions" value={data.instructions} />}
      {data.reason && (
        <div className="htl-detail-note">
          <strong>Why this combo?</strong> {data.reason}
        </div>
      )}
    </div>
  )
}

function MovieDetail({ data }: { data: any }) {
  const top = data.top_pick || {}
  return (
    <div className="htl-detail-grid">
      <DetailField label="Mood" value={data.mood} />
      <DetailField label="Genre" value={data.genre} />
      <DetailField label="Language" value={data.language} />
      {top.description && (
        <div style={{ gridColumn: '1 / -1', marginTop: 4, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          <span style={{ color: 'var(--text)', fontWeight: 500 }}>Description:</span> {top.description}
        </div>
      )}
      {top.reason && (
        <div className="htl-detail-note">
          <strong>Why this pick?</strong> {top.reason}
        </div>
      )}
      {Array.isArray(data.alternatives) && data.alternatives.length > 0 && (
        <div className="htl-alternatives">
          <h5>Alternatives Suggested</h5>
          {data.alternatives.map((alt: any, i: number) => (
            <div key={i} className="htl-alt-item">
              <span className="htl-alt-title">{alt.title}</span>{' '}
              <span className="htl-alt-note">— {alt.note}</span>
            </div>
          ))}
        </div>
      )}
      {data.comment && (
        <div className="htl-detail-note movie-comment">
          <strong>💬 AI Note:</strong> {data.comment}
        </div>
      )}
    </div>
  )
}

function TimelineCard({ item, expanded, onToggle, onDelete }: {
  item: TimelineItem; expanded: boolean; onToggle: () => void; onDelete: () => void
}) {
  const isMeal = item.type === 'meal'
  const data = item.data || {}
  const top = data.top_pick || {}
  const title = isMeal ? `${data.mains || '—'} with ${data.base || '—'}` : top.title || 'Untitled'
  const meta = isMeal ? [data.mealType, data.dietType].filter(Boolean).join(' · ') : [data.genre, data.language].filter(Boolean).join(' · ')
  const tags = isMeal
    ? [data.base && `🍚 ${data.base}`, data.pulses && `🥘 ${data.pulses}`, data.sides && `🥗 ${data.sides}`, data.beverage && `🍵 ${data.beverage}`].filter(Boolean)
    : [data.mood && `✨ ${data.mood}`].filter(Boolean)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    const text = isMeal
      ? `${title}\nBase: ${data.base}\nPulses: ${data.pulses}\nMains: ${data.mains}\nSides: ${data.sides}\nBeverage: ${data.beverage}\n\n${data.reason || ''}`
      : `${title}\nGenre: ${data.genre}\nLanguage: ${data.language}\nMood: ${data.mood}\n\n${top.reason || ''}`
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  return (
    <div
      onClick={onToggle}
      className={`htl-card ${isMeal ? 'meal' : 'movie'} ${expanded ? 'expanded' : ''}`}
    >
      <div className="htl-card-header">
        <div className="htl-card-icon">
          {isMeal ? '🥗' : '🎬'}
        </div>
        <div className="htl-card-body">
          <div className="htl-card-title">{title}</div>
          <div className="htl-card-meta">{meta}</div>
          {tags.length > 0 && (
            <div className="htl-card-tags">
              {tags.slice(0, 4).map((tag, i) => (
                <span key={i} className="htl-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
        <span className="htl-card-time">{formatTime(item.timestamp)}</span>
        <ChevronRight size={14} className={`htl-card-chevron ${expanded ? 'open' : ''}`} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="htl-detail">
              {isMeal ? <MealDetail data={data} /> : <MovieDetail data={data} />}
              <div className="htl-actions">
                <button className="htl-action-btn" onClick={handleCopy}><Copy size={12} /> Copy</button>
                <button className="htl-action-btn danger" onClick={(e) => { e.stopPropagation(); onDelete() }}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TimelineSkeleton() {
  return (
    <div style={{ marginTop: 16 }}>
      {[1, 2].map(g => (
        <div key={g} style={{ marginBottom: 24 }}>
          <div className="htl-skeleton" style={{ height: 16, width: 160, marginBottom: 12 }} />
          {[1, 2].map(c => (
            <div key={c} className="htl-card" style={{ padding: 16, marginBottom: 10, display: 'flex', gap: 12, cursor: 'default' }}>
              <div className="htl-skeleton" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="htl-skeleton" style={{ height: 16, width: '75%', marginBottom: 8 }} />
                <div className="htl-skeleton" style={{ height: 12, width: '50%', marginBottom: 8 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <div className="htl-skeleton" style={{ height: 20, width: 80, borderRadius: 6 }} />
                  <div className="htl-skeleton" style={{ height: 20, width: 64, borderRadius: 6 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="htl-empty">
      <div className="htl-empty-icon">📭</div>
      <p>No history yet.</p>
      <p className="htl-empty-sub">Start by planning a meal or picking a movie!</p>
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════ */
export default function HistoryTimeline({ filter }: { filter?: 'meal' | 'movie' | 'all' }) {
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [movies, setMovies] = useState<MovieEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<'all' | 'meal' | 'movie'>(filter || 'all')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [m, mv] = await Promise.all([getAllMeals(), getAllMovies()])
      setMeals(m); setMovies(mv)
    } catch (err) {
      console.error('Failed to load history', err)
      toast.error('Failed to load history data')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const allItems: TimelineItem[] = useMemo(() => {
    const m: TimelineItem[] = meals.map(m => ({ id: m.id!, type: 'meal', timestamp: m.timestamp, data: m.data }))
    const mv: TimelineItem[] = movies.map(m => ({ id: m.id!, type: 'movie', timestamp: m.timestamp, data: m.data }))
    return [...m, ...mv].sort((a, b) => b.timestamp - a.timestamp)
  }, [meals, movies])

  const filteredItems = useMemo(() => typeFilter === 'all' ? allItems : allItems.filter(i => i.type === typeFilter), [allItems, typeFilter])
  const groups = useMemo(() => groupByDate(filteredItems), [filteredItems])

  const handleDelete = async (item: TimelineItem) => {
    try {
      if (item.type === 'meal') {
        await deleteMeal(item.id)
        setMeals(prev => prev.filter(m => m.id !== item.id))
      } else {
        const db = await new Promise<IDBDatabase>((res, rej) => { const r = indexedDB.open('MovieRecommenderDB', 1); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error) })
        await new Promise<void>((res, rej) => { const tx = db.transaction('movies', 'readwrite'); tx.objectStore('movies').delete(Number(item.id)); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error) })
        setMovies(prev => prev.filter(m => m.id !== item.id))
      }
      toast.success(`${item.type === 'meal' ? 'Meal' : 'Movie'} deleted`)
      if (expandedId === `${item.type}-${item.id}`) setExpandedId(null)
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="htl-root">
      <style>{scopedStyles}</style>

      {/* Filter bar */}
      <div className="htl-filters">
        {(['all', 'meal', 'movie'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`htl-filter-btn ${typeFilter === t ? 'active' : ''}`}
          >
            {t === 'all' ? 'All' : t === 'meal' ? '🥗 Meals' : '🎬 Movies'}
          </button>
        ))}
        <button className="htl-refresh-btn" onClick={load}>
          <RefreshCw size={12} /> Refresh
        </button>
        <span className="htl-data-note" style={{ display: 'none' }}>
          Data from your local IndexedDB
        </span>
      </div>

      {/* Stats */}
      {!loading && <StatsRow meals={meals} movies={movies} />}

      {/* Heatmap */}
      {!loading && allItems.length > 0 && <Heatmap items={allItems} />}

      {/* Loading / Empty */}
      {loading && <TimelineSkeleton />}
      {!loading && filteredItems.length === 0 && <EmptyState />}

      {/* Timeline */}
      {!loading && groups.length > 0 && (
        <div className="htl-timeline">
          {groups.map((group, gi) => (
            <div key={group.date} className="htl-group">
              <div className="htl-date">
                {group.dateLabel}
                <span className="htl-count">{group.items.length} item{group.items.length > 1 ? 's' : ''}</span>
              </div>
              {group.items.map((item, ci) => {
                const cardId = `${item.type}-${item.id}`
                return (
                  <motion.div
                    key={cardId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.05 + ci * 0.03, duration: 0.35 }}
                  >
                    <TimelineCard
                      item={item}
                      expanded={expandedId === cardId}
                      onToggle={() => setExpandedId(prev => prev === cardId ? null : cardId)}
                      onDelete={() => handleDelete(item)}
                    />
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
