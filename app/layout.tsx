"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { QueryProvider } from "@/providers/query-provider"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/sonner"
import { usePathname } from "next/navigation"
import { useTokenCapture } from "@/network/hooks/auth/useTokenCapture"


const Header = dynamic(() => import("@/components/layout/header").then(mod => ({ default: mod.Header })), { 
  ssr: false,
  loading: () => (
    <div className="border-b border-orange-200/50 backdrop-blur-sm bg-white/80 dark:border-gray-700/50 dark:bg-black/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-64 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  )
})

const I18nProvider = dynamic(() => import("@/components/layout/i18n-provider").then(mod => ({ default: mod.I18nProvider })), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Carregando...</p>
        </div>
      </div>
    </div>
  )
})

const AuthProvider = dynamic(() => import("@/contexts/auth-context").then(mod => ({ default: mod.AuthProvider })), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Carregando...</p>
        </div>
      </div>
    </div>
  )
})

const inter = Inter({ subsets: ["latin"] })

function RouteProtector({ children, isAuthPage }: { children: React.ReactNode, isAuthPage: boolean }) {
  const pathname = usePathname()

  // Para páginas de autenticação pura (/login, /register, /auth/register, /forgot-password, /reset-password, /auth/reset-password), não mostrar header
  if (pathname === '/login' || pathname === '/register' || pathname === '/auth/register' || pathname === '/forgot-password' || pathname === '/reset-password' || pathname === '/auth/reset-password') {
    return <>{children}</>
  }

  // Para todas as outras páginas (incluindo /), sempre mostrar header
  return (
    <>
      <Suspense fallback={
        <div className="border-b border-orange-200/50 backdrop-blur-sm bg-white/80 dark:border-gray-700/50 dark:bg-black/80 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-64 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      }>
        <Header />
      </Suspense>
      {children}
    </>
  )
}

function TokenCaptureWrapper() {
  useTokenCapture()
  return null
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/auth/register' || pathname === '/forgot-password' || pathname === '/reset-password' || pathname === '/auth/reset-password'

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>iChef24 - IA Culinária Inteligente</title>
        <meta name="description" content="Crie receitas personalizadas com nossa IA avançada. Transforme ingredientes simples em pratos extraordinários com o poder da inteligência artificial culinária." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <QueryProvider>
          <I18nProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider>
                <Suspense fallback={null}>
                  <TokenCaptureWrapper />
                </Suspense>
                <RouteProtector isAuthPage={isAuthPage}>
                  {children}
                  <Toaster 
                    position="top-right"
                    duration={4000}
                  />
                </RouteProtector>
              </AuthProvider>
            </ThemeProvider>
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  )
}