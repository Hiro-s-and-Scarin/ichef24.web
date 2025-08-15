import { api } from "@/lib/api/api"

export const initiateGoogleAuth = async () => {
  // Redireciona para o endpoint de login do Google no backend
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/google/login`
}

export const initiateFacebookAuth = async () => {
  // Redireciona para o endpoint de login do Facebook no backend
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/facebook/login`
}

 