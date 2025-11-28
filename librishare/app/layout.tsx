import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster" 
import "./globals.css"

export const metadata: Metadata = {
  title: "LibriShare", 
  description: "A complete platform for book management",
  generator: "v0.app",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" 
          forcedTheme="dark" 
          enableSystem={false}
          disableTransitionOnChange
          storageKey="librishare-ui-theme"
        >
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster /> 
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}