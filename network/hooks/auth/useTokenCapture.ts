"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { setCookie } from 'nookies'
import { toast } from "sonner"
import { getUserPlanStatus } from "@/network/actions/plans"

export function useTokenCapture() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleTokenCapture = async () => {
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
          
          // Verificar se o usuário tem plano ativo
          const planStatus = await getUserPlanStatus()
          
          if (planStatus.success && planStatus.data) {
            // Usuário tem plano ativo, permanecer na página atual
            console.log("Usuário tem plano ativo:", planStatus.data)
          } else {
            // Usuário não tem plano ativo, redirecionar para /plans
            setTimeout(() => {
              router.push("/plans")
            }, 100)
          }
        } catch (error) {
          toast.error("Erro ao processar autenticação")
        }
      }
    }

    handleTokenCapture()
  }, [searchParams, router])

  return null
} 