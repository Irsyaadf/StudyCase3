"use client";

import ReduxProvider from "@/store/provider";
import AppHeader from "@/app/components/common/Header/header";
import '@/styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AppHeader />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
