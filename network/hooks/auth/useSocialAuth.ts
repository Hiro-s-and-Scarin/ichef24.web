"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { initiateGoogleAuth, initiateFacebookAuth } from "@/network/actions/auth/socialAuth"

export function useGoogleAuth() {
  const router = useRouter()

  const handleGoogleAuth = async () => {
    try {
      await initiateGoogleAuth()
    } catch (error) {
      toast.error("Erro ao iniciar autenticação com Google")
      console.error("Google auth error:", error)
    }
  }

  return { handleGoogleAuth }
}

export function useFacebookAuth() {
  const router = useRouter()

  const handleFacebookAuth = async () => {
    try {
      await initiateFacebookAuth()
    } catch (error) {
      toast.error("Erro ao iniciar autenticação com Facebook")
      console.error("Facebook auth error:", error)
    }
  }

  return { handleFacebookAuth }
} 