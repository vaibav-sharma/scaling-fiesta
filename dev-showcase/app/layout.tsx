import './globals.css';
import React from 'react';
import ThemeToggle from '../app/themeToggle'; // 👈 import the new toggle component

export const metadata = {
  title: 'Vaibav Sharma — Building Intelligent Apps for the Future'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (localStorage.theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            `,
          }}
        />
        <header className="flex items-center justify-between p-4 border-b border-sand/10">
          <h1 className="font-semibold text-lg">Dev Showcase Lab</h1>
          <ThemeToggle /> {/* 👈 place it in your header */}
        </header>

        <main className="min-h-screen bg-primary text-softwhite">{children}</main>
      </body>
    </html>
  );
}