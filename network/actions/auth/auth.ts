import { api } from "@/lib/api"
import { LoginFormData, RegisterFormData, User, AuthResponse, ResetPasswordData, ConfirmResetPasswordData } from "@/types/auth"

export async function postLogin(body: LoginFormData): Promise<AuthResponse> {
  const { data } = await api.post("/auth/login", body)
  return data
}

export async function postRegister(body: RegisterFormData): Promise<AuthResponse> {
  const { data } = await api.post("/auth/register", body)
  return data
}

export async function postForgotPassword(email: string): Promise<{ message: string }> {
  const { data } = await api.post("/auth/forgot-password", { email })
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await api.get("/auth/me")
  return data.user
}

export async function postLogout(): Promise<{ message: string }> {
  const { data } = await api.post("/auth/logout")
  return data
}

export async function postSendResetPassword(body: ResetPasswordData): Promise<{ message: string }> {
  const { data } = await api.post("/auth/send-reset-password", body)
  return data
}

export async function postConfirmCodeResetPassword(body: ConfirmResetPasswordData): Promise<{ passwordUpdated: any }> {
  const { data } = await api.post("/auth/confirm-code-reset-password", body)
  return data
}

export async function putUpdateProfile(body: Partial<User>): Promise<User> {
  const { data } = await api.put("/auth/profile", body)
  return data.user
}

export async function putUpdatePassword(body: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
  const { data } = await api.put("/auth/password", body)
  return data
}