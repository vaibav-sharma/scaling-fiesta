import { create } from 'zustand'

interface ShowcaseState {
  activeComponent: string | null
  setActiveComponent: (name: string) => void
}

export const useShowcaseStore = create<ShowcaseState>((set) => ({
  activeComponent: "meal-planner",
  setActiveComponent: (name) => set({ activeComponent: name }),
}))