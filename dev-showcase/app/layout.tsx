import "./globals.css";
import React from "react";

export const metadata = {
  title: "Vaibav",
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
    <html lang="en">
      <body className="bg-background text-foreground">
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
        {children}
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