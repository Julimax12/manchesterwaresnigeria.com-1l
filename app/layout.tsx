import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PWAProvider } from "@/components/pwa-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MUFC Nigeria Store - Official Manchester United Merchandise",
  description:
    "Your trusted source for authentic Manchester United merchandise in Nigeria. Shop jerseys, training gear, accessories and more.",
  manifest: "/manifest.json",
  themeColor: "#dc2626",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MUFC Nigeria Store",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "MUFC Nigeria Store",
    title: "Official Manchester United Store Nigeria",
    description: "Authentic Manchester United merchandise delivered across Nigeria",
  },
  twitter: {
    card: "summary",
    title: "MUFC Nigeria Store",
    description: "Official Manchester United merchandise in Nigeria",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <PWAProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster richColors position="top-center" />
          </PWAProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
