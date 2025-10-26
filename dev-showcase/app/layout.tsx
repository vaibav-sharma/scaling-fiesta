import Link from "next/link";
import "./globals.css";
import React from "react";
import { HomeIcon } from "lucide-react";
import ThemeToggle from "../src/utils/themeToggle";
import LayoutHeader from "@/src/utils/LayoutHeader";
import TouchDebugger from "./touchdebugger";
import MainLayout from "./mainPage";
import WorldMap from "@/src/components/ui/world-map";

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
      <body className="bg-background text-foreground overflow-hidden">
        <div className="flex flex-col min-h-screen">
          <LayoutHeader />
          <MainLayout children={children} />
          {/* <div>
            <WorldMap
              dots={[
                {
                  start: {
                    lat: 64.2008,
                    lng: -149.4937,
                  }, // Alaska (Fairbanks)
                  end: {
                    lat: 34.0522,
                    lng: -118.2437,
                  }, // Los Angeles
                },
                {
                  start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
                  end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                },
                {
                  start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                  end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
                },
                {
                  start: { lat: 51.5074, lng: -0.1278 }, // London
                  end: { lat: 28.6139, lng: 77.209 }, // New Delhi
                },
                {
                  start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                  end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
                },
                {
                  start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                  end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
                },
              ]}
            />
          </div> */}


          {/* <main
            id="main-content"
            className="flex-1 relative flex justify-center overflow-visible"
            style={{
              touchAction: "auto", // ✅ enable all gestures
              WebkitUserSelect: "none",
              userSelect: "none",
            }}
          >
            {children}
          </main> */}
        </div>
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