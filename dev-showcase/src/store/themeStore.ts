'use client';
import { create } from 'zustand';

type ThemeColor = 'ocean' | 'sunset' | 'blue';
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

    color: typeof window !== 'undefined' && localStorage.getItem('color') === 'ocean'
        ? 'ocean'
        : 'sunset',

    toggleColorScheme: (color) =>
        set(() => {
            const root = document.documentElement;
            root.classList.remove('theme-ocean', 'theme-sunset', 'theme-blue');
            root.classList.add(`theme-${color}`);
            localStorage.setItem('color', color);
            return { color };
        }),
}));