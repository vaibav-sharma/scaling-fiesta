import { create } from 'zustand'
import { apiRequest } from '@/src/utils/apiClient'

interface AuthState {
  email: string
  password: string
  loading: boolean
  warming: boolean
  serverStatus: boolean
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  login: () => Promise<void>
  warmUp: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  email: '',
  password: '',
  loading: false,
  warming: false,
  serverStatus: false,

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),

  login: async () => {
    const { email, password } = get()
    if (!email || !password) {
      alert('Please enter both email and password')
      return
    }

    set({ loading: true })

    const result = await apiRequest({
      method: 'POST',
      url: 'https://backend-51tb.onrender.com/token',
      operation: 'LoginUser',
      payload: { username: email.trim(), password: password.trim() },
      payloadType: 'form',
      retry: true,
    })

    set({ loading: false })

    if (result.success) {
      localStorage.setItem('loggedIn', 'true')
      window.location.href = '/'
    } else {
      console.error('Login failed:', result.error)
    }
  },

  warmUp: async () => {
    set({ warming: true })
    const result = await apiRequest({
      method: 'GET',
      url: 'https://backend-51tb.onrender.com/health',
      operation: 'WarmUp',
      payloadType: 'json',
      retry: true,
    })
    set({ warming: false, serverStatus: result.success })
  },

  logout: () => {
    localStorage.removeItem('loggedIn')
    set({ email: '', password: '', loading: false, serverStatus: false })
  },
}))