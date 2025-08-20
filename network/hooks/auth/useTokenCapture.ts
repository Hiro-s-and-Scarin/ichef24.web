"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { setCookie } from 'nookies'
import { toast } from "sonner"

export function useTokenCapture() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      try {
        // Armazena o token JWT nos cookies
        setCookie(null, 'jwt', token, {
          maxAge: 30 * 24 * 60 * 60, // 30 dias
          path: '/',
        })

        toast.success("Login realizado com sucesso!")
        
        // Remove o token da URL e redireciona para dashboard
        const url = new URL(window.location.href)
        url.searchParams.delete('token')
        window.history.replaceState({}, document.title, url.pathname)
        
        // Redireciona para dashboard
        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      } catch (error) {
        toast.error("Erro ao processar autenticação")
      }
    }
  }, [searchParams, router])

  return null
} 