import Link from "next/link";
import "./globals.css";
import React from "react";
import { HomeIcon } from "lucide-react";
import ThemeToggle from "../src/utils/themeToggle";
import TouchDebugger from "./touchdebugger";
import MainLayout from "./mainPage";
import WorldMap from "@/src/components/ui/world-map";
import { Providers } from "./providers";
import { HeaderWrapper } from "./header-wrapper";

export const metadata = {
  title: "Lazynoons",
  description: 'A collection of interactive developer tools and demos',
  icons: {
    icon: '/favicon.png', // your favicon path in public/
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  // title: "Vaibav Sharma — Building Intelligent Apps for the Future",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <HeaderWrapper />
            <MainLayout children={children} />
          </div>
        </Providers>
      </body>
    </html>
  );
}


// import "./globals.css";
// import React from "react";
// import ThemeToggle from "../app/themeToggle";

// export const metadata = {
//   title: "Vaibav Sharma — Building Intelligent Apps for the Future",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="flex flex-col min-h-screen bg-background text-foreground">
//         {/* Dark mode detection */}
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               if (localStorage.theme === 'dark') {
//                 document.documentElement.classList.add('dark');
//               } else {
//                 document.documentElement.classList.remove('dark');
//               }
//             `,
//           }}
//         />

//         {/* Header */}
//         <header className="flex items-center justify-between p-4 border-b border-border bg-card z-20">
//           <h1 className="font-semibold text-lg">Dev Showcase Lab</h1>
//           <ThemeToggle />
//         </header>

//         {/* Main Content */}
//         <main className="flex-1 relative z-10 overflow-hidden">
//           {children}
//         </main>
//       </body>
//     </html>
//   );
// }