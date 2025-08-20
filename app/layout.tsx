"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { QueryProvider } from "@/providers/query-provider"
import { Header } from "@/components/layout/header"
import { AuthProvider } from "@/contexts/auth-context"
import { I18nProvider } from "@/components/layout/i18n-provider"
import { Toaster } from "sonner"
import { usePathname, useRouter } from "next/navigation"
import { useTokenCapture } from "@/network/hooks/auth/useTokenCapture"
import { parseCookies } from 'nookies'
import { useEffect } from "react"

const inter = Inter({ subsets: ["latin"] })

// Componente para proteger rotas
function RouteProtector({ children, isAuthPage }: { children: React.ReactNode, isAuthPage: boolean }) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthPage) {
      // Verifica se existe JWT nos cookies
      const cookies = parseCookies()
      const token = cookies.jwt

      if (!token) {
        // Se não há token, redireciona para login
        router.replace('/')
      }
    }
  }, [isAuthPage, router])

  // Se é página de auth, não mostra header
  if (isAuthPage) {
    return <>{children}</>
  }

  // Se não é página de auth, verifica token antes de renderizar
  const cookies = parseCookies()
  const token = cookies.jwt

  if (!token) {
    // Se não há token, não renderiza nada (será redirecionado)
    return null
  }

  // Se há token, mostra header e conteúdo
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/' || pathname === '/auth/register' || pathname === '/auth/forgot-password' || pathname === '/auth/reset-password'

  // Captura o token da URL em qualquer página
  useTokenCapture()

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
                <RouteProtector isAuthPage={isAuthPage}>
                  {children}
                </RouteProtector>
                <Toaster position="top-right" />
              </AuthProvider>
            </ThemeProvider>
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  )
}