export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "user" | "premium" | "admin"
  preferences: {
    theme: "light" | "dark" | "system"
    language: "pt-BR" | "en-US"
    notifications: {
      email: boolean
      push: boolean
    }
  }
  subscription?: {
    plan: "free" | "pro" | "premium"
    status: "active" | "cancelled" | "expired"
    expiresAt?: string
  }
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  data: string
  user?: User
}

export interface ResetPasswordData {
  email: string
  currentPassword: string
  newPassword: string
}

export interface ConfirmResetPasswordData {
  email: string
  code: string
  newPassword: string
}