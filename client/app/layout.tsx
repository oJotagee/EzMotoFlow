import { QueryProvider } from "./providers/query";
import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Backoffice Abba",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt" className="h-full min-h-screen">
      <body className="h-[100vh] flex bg-gray-100 dark:bg-gray-800" cz-shortcut-listen="true">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}

