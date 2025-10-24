// 'use client';

import { useThemeStore } from '@/src/store/themeStore';
import { Button } from '@/src/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      onClick={toggleTheme}
      className="border border-sand/20 bg-primary/10 hover:bg-primary/20 text-softwhite"
    >
      {/* {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'} */}
      {theme === 'dark' ? <Moon className="h-5 w-5" />
        : <Sun className="h-5 w-5" />}
    </Button>
  );
}