export * from './auth'
export * from './recipe'

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

export interface Plan {
  id: string
  name: string
  price: {
    monthly: number
    yearly: number
  }
  features: string[]
  limitations?: string[]
  isPopular: boolean
  stripe_subscription_id: string
  plan_type: string
  billing_cycle: string
  amount: number
  currency: string
  status: string
  metadata?: any
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  plan: Plan
  status: "active" | "cancelled" | "expired"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiError {
  message: string
  status: number
  details?: any
}