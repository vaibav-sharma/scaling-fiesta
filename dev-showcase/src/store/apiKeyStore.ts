'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface APIKeyStore {
  googleApiKey: string | null
  setGoogleApiKey: (key: string) => void
  clearGoogleApiKey: () => void
  hasApiKey: () => boolean
}

export const useAPIKeyStore = create<APIKeyStore>()(
  persist(
    (set, get) => ({
      googleApiKey: null,

      setGoogleApiKey: (key: string) => {
        set({ googleApiKey: key.trim() })
      },

      clearGoogleApiKey: () => {
        set({ googleApiKey: null })
      },

      hasApiKey: () => {
        return !!get().googleApiKey
      },
    }),
    {
      name: 'api-key-store',
    }
  )
)
