import { create } from 'zustand'
import { signIn, signOut, useSession } from 'next-auth/react'

interface OAuthState {
  isOAuthLoading: boolean
  oauthError: string | null
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useOAuthStore = create<OAuthState>((set) => ({
  isOAuthLoading: false,
  oauthError: null,

  signInWithGoogle: async () => {
    set({ isOAuthLoading: true, oauthError: null })
    try {
      const result = await signIn('google', {
        redirect: true,
        callbackUrl: '/',
      })
      
      if (!result?.ok) {
        set({ oauthError: 'Google authentication failed' })
      }
    } catch (error) {
      set({ 
        oauthError: error instanceof Error ? error.message : 'Authentication failed'
      })
    } finally {
      set({ isOAuthLoading: false })
    }
  },

  signInWithGithub: async () => {
    set({ isOAuthLoading: true, oauthError: null })
    try {
      const result = await signIn('github', {
        redirect: true,
        callbackUrl: '/',
      })
      
      if (!result?.ok) {
        set({ oauthError: 'GitHub authentication failed' })
      }
    } catch (error) {
      set({ 
        oauthError: error instanceof Error ? error.message : 'Authentication failed'
      })
    } finally {
      set({ isOAuthLoading: false })
    }
  },

  logout: async () => {
    set({ isOAuthLoading: true })
    try {
      await signOut({ redirect: true, callbackUrl: '/login' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      set({ isOAuthLoading: false })
    }
  },

  clearError: () => set({ oauthError: null }),
}))
