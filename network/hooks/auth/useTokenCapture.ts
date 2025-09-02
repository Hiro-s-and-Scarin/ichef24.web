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
        setCookie(null, 'jwt', token, {
          maxAge: 30 * 24 * 60 * 60, 
          path: '/',
        })

        toast.success("Login realizado com sucesso!")
        
        const url = new URL(window.location.href)
        url.searchParams.delete('token')
        window.history.replaceState({}, document.title, url.pathname)
        
        setTimeout(() => {
          router.push("/plans")
        }, 100)
      } catch (error) {
        toast.error("Erro ao processar autenticação")
      }
    }
  }, [searchParams, router])

  return null
} 