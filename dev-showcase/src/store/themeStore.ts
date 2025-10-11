'use client';
import { create } from 'zustand';

type ThemeState = {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
    theme: (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark') ? 'dark' : 'light',
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
        return { theme: newTheme };
    }),
}));