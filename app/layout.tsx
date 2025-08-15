"use client"

import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { QueryProvider } from "@/providers/query-provider"
import { Header } from "@/components/layout/header"
import { AuthProvider } from "@/contexts/auth-context"
import { I18nProvider } from "@/components/layout/i18n-provider"
import { Toaster } from "sonner"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register'

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>iChef24 - IA Culinária Inteligente</title>
        <meta name="description" content="Crie receitas personalizadas com nossa IA avançada. Transforme ingredientes simples em pratos extraordinários com o poder da inteligência artificial culinária." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <I18nProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider>
                {!isAuthPage && <Header />}
                {children}
                <Toaster position="top-right" />
              </AuthProvider>
            </ThemeProvider>
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  )
}