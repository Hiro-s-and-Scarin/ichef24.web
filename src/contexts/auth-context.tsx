"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useLogin, useRegister, useLogout, useMe } from "@/network/hooks/auth/useAuth"
import { User as AuthUser } from "@/types/auth"

interface User {
  id: string
  name: string
  email: string
  plan: "free" | "chef" | "master"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, plan?: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const logoutMutation = useLogout()
  const { data: userData, isLoading: isUserLoading } = useMe()

  useEffect(() => {
    if (userData) {
      const mappedUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        plan: "free", // Default plan for now
        avatar: userData.avatar_url
      }
      setUser(mappedUser)
    } else {
      setUser(null)
    }
    setIsLoading(isUserLoading)
  }, [userData, isUserLoading])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({ email, password })
      return true
    } catch (error) {
      // Error already handled by mutation
      return false
    }
  }

  const register = async (name: string, email: string, password: string, plan = "free"): Promise<boolean> => {
    try {
      await registerMutation.mutateAsync({
        name,
        email,
        password,
        confirmPassword: password
      })
      return true
    } catch (error) {
      // Error already handled by mutation
      return false
    }
  }

  const logout = () => {
    logoutMutation.mutate()
    setUser(null)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser,
        login, 
        register, 
        logout, 
        isLoading: isLoading || loginMutation.isPending || registerMutation.isPending 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}