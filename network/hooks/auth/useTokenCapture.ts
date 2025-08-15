"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { setCookie } from 'nookies'
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

export function useTokenCapture() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      try {
        // Armazena o token JWT nos cookies
        setCookie(null, 'jwt', token, {
          maxAge: 30 * 24 * 60 * 60, // 30 dias
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })

        // Decodifica o token para obter informações do usuário
        const tokenPayload = JSON.parse(atob(token.split('.')[1]))
        
        // Atualiza o contexto de autenticação
        setUser({
          id: tokenPayload.userId,
          email: tokenPayload.email,
          token: token
        })

        toast.success("Login realizado com sucesso!")
        
        // Remove o token da URL e redireciona para a página inicial
        const url = new URL(window.location.href)
        url.searchParams.delete('token')
        window.history.replaceState({}, document.title, url.pathname)
        
        // Pequeno delay para garantir que o estado foi atualizado
        setTimeout(() => {
          router.push("/")
        }, 100)
      } catch (error) {
        console.error("Erro ao processar token:", error)
        toast.error("Erro ao processar autenticação")
        router.push("/login")
      }
    }
  }, [searchParams, setUser, router])

  return null
} 