"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { 
  LoginFormData, 
  RegisterFormData, 
  ResetPasswordFormData, 
  ConfirmResetPasswordFormData,
  ForgotPasswordFormData
} from "@/schemas/auth.schema"
import { 
  getMe, 
  postLogin, 
  postLogout, 
  postRegister, 
  postForgotPassword, 
  postConfirmForgotPassword,
  postSendResetPassword, 
  postConfirmCodeResetPassword,
  putUpdateProfile,
  putUpdatePassword
} from "@/network/actions/auth/auth"
import { setCookie, destroyCookie, parseCookies } from 'nookies'
import { queryKeys } from "@/lib/config/query-keys"

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (body: LoginFormData) => {
      return await postLogin(body)
    },
    onSuccess: (response) => {
      setCookie(null, 'jwt', response, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
      
      toast.success("Login realizado com sucesso!")
      
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao fazer login")
      console.error("Error logging in:", error)
    },
  })

  return mutate
}

export function useRegister() {
  const router = useRouter()

  const mutate = useMutation({
    mutationFn: async (body: RegisterFormData) => {
      return await postRegister(body)
    },
    onSuccess: (data) => {
      toast.success("Conta criada com sucesso! Faça login para continuar.")
      router.push("/")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao criar conta")
      console.error("Error registering:", error)
    },
  })

  return mutate
}

export function useForgotPassword() {
  const mutate = useMutation({
    mutationFn: async (email: string) => {
      return await postForgotPassword(email)
    },
    onSuccess: (data) => {
      toast.success(data.message || "Email de recuperação enviado!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao enviar email de recuperação")
      console.error("Error sending forgot password email:", error)
    },
  })

  return mutate
}

export function useConfirmForgotPassword() {
  const mutate = useMutation({
    mutationFn: async (data: { code: string; newPassword: string }) => {
      return await postConfirmForgotPassword(data)
    },
    onSuccess: (data) => {
      toast.success("Senha alterada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Código inválido ou expirado")
      console.error("Error confirming forgot password:", error)
    },
  })

  return mutate
}

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => await getMe(),
    retry: 0,
    staleTime: 1000 * 60 * 5,
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async () => {
      console.log('🔐 useLogout: Chamando endpoint de logout...');
      const result = await postLogout()
      console.log('🔐 useLogout: Resposta do endpoint:', result);
      return result;
    },
    onSuccess: () => {
      // Limpar todos os cookies relacionados à autenticação
      destroyCookie(null, 'jwt')
      destroyCookie(null, 'user')
      
      // Limpar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem("user")
        localStorage.clear()
      }
      
      // Limpar cache do React Query
      queryClient.clear()
      
      toast.success("Logout realizado com sucesso!")
      
      // Redirecionar para a página inicial
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 100)
    },
    onError: (error: any) => {
      // Mesmo em caso de erro, limpar tudo
      destroyCookie(null, 'jwt')
      destroyCookie(null, 'user')
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem("user")
        localStorage.clear()
      }
      
      queryClient.clear()
      toast.error(error.response?.data?.message || "Erro ao fazer logout")
      
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 100)
    },
  })

  return mutate
}

export function useSendResetPassword() {
  const router = useRouter()

  const mutate = useMutation({
    mutationFn: async (body: ResetPasswordFormData) => {
      return await postSendResetPassword(body)
    },
    onSuccess: (data, variables) => {
      setCookie(null, 'reset_email', variables.email, {
        maxAge: 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      
      setCookie(null, 'reset_password', variables.newPassword, {
        maxAge: 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      
      toast.success(data.message || "Código de verificação enviado para seu email!")
      
      setTimeout(() => {
        router.push("/auth/reset-password")
      }, 1000)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao enviar código de verificação")
      console.error("Error sending reset password code:", error)
    },
  })

  return mutate
}

export function useConfirmCodeResetPassword() {
  const router = useRouter()
  
  const mutate = useMutation({
    mutationFn: async (body: ConfirmResetPasswordFormData) => {
      return await postConfirmCodeResetPassword(body)
    },
    onSuccess: (data) => {
      destroyCookie(null, 'reset_email')
      destroyCookie(null, 'reset_password')
      
      toast.success("Senha alterada com sucesso!")
    
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Código inválido ou expirado")
      console.error("Error confirming reset password code:", error)
    },
  })

  return mutate
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (body: any) => {
      return await putUpdateProfile(body)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
      toast.success("Perfil atualizado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar perfil")
      console.error("Error updating profile:", error)
    },
  })

  return mutate
}

export function useUpdatePassword() {
  const mutate = useMutation({
    mutationFn: async (body: { currentPassword: string; newPassword: string }) => {
      return await putUpdatePassword(body)
    },
    onSuccess: (data) => {
      toast.success("Senha atualizada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar senha")
      console.error("Error updating password:", error)
    },
  })

  return mutate
}

export function useResetPasswordData() {
  const getResetData = () => {
    if (typeof window === 'undefined') {
      return { email: null, newPassword: null }
    }
    
    try {
      const cookies = parseCookies()
      
      const result = {
        email: cookies.reset_email || null,
        newPassword: cookies.reset_password || null
      }
      
      return result
    } catch (error) {
      console.error("useResetPasswordData: Erro ao ler cookies:", error)
      return { email: null, newPassword: null }
    }
  }

  const clearResetData = () => {
    try {
      destroyCookie(null, 'reset_email')
      destroyCookie(null, 'reset_password')
    } catch (error) {
      console.error("useResetPasswordData: Erro ao limpar cookies:", error)
    }
  }

  return { getResetData, clearResetData }
}