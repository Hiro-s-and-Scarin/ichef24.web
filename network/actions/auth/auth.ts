import { api } from "@/lib/api/api"
import type { 
  LoginFormData, 
  RegisterFormData, 
  ForgotPasswordFormData,
  ResetPasswordFormData,
  ConfirmResetPasswordFormData 
} from "@/schemas/auth.schema"

export const postLogin = async (body: LoginFormData) => {
  const response = await api.post("/auth", body)
  return response.data
}

export const postRegister = async (body: RegisterFormData) => {
  const response = await api.post("/users", body)
  return response.data
}

export const getMe = async () => {
  const response = await api.get("/users/me")
  return response.data.data
}

export const postLogout = async () => {
  const response = await api.get("/auth/logout")
  return response.data
}

export const putUpdateProfile = async (body: any) => {
  const response = await api.put("/users/me", body)
  return response.data.data
}

export const putUpdatePassword = async (body: { currentPassword: string; newPassword: string }) => {
  const response = await api.post("/auth/reset-password", body)
  return response.data
}

export const postForgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email })
  return response.data
}

export const postSendResetPassword = async (body: ResetPasswordFormData) => {
  const response = await api.post("/auth/send-reset-password", body)
  return response.data
}

export const postConfirmCodeResetPassword = async (body: ConfirmResetPasswordFormData) => {
  const response = await api.post("/auth/confirm-code-reset-password", body)
  return response.data
}