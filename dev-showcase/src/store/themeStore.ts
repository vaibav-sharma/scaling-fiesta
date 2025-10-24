'use client';
import { create } from 'zustand';

type ThemeColor = 'ocean' | 'sunset' | 'forest';
type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  color: ThemeColor;
  toggleColorScheme: (color: ThemeColor) => void; // <- not optional
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme:
    typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark'
      ? 'dark'
      : 'light',

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
      return { theme: newTheme };
    }),

  color: 'ocean',

  toggleColorScheme: (color) =>
    set(() => {
      // Clear previous theme color classes
      document.documentElement.classList.remove('theme-ocean', 'theme-sunset', 'theme-forest');

      // Add the new color theme class to <html>
      document.documentElement.classList.add(`theme-${color}`);

      return { color };
    }),
}));