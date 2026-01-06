"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import {
  useLogin,
  useRegister,
  useLogout,
  useMe,
} from "@/network/hooks/auth/useAuth";
import { User as AuthUser } from "@/types/auth";
import { useWebSocket } from "@/hooks/useWebSocket";

interface User {
  id: string;
  name: string;
  email: string;
  plan: "free" | "chef" | "master";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    plan?: string,
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const { data: userData, isLoading: isUserLoading } = useMe();

  // Controlar montagem para evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Só executar após montagem para evitar inconsistências SSR/CSR
    if (!mounted) return;

    if (userData) {
      const mappedUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        plan: "free", // Default plan for now
        avatar: userData.avatar_url,
      };
      setUser(mappedUser);
    } else {
      setUser(null);
    }
    setIsLoading(isUserLoading);
  }, [userData, isUserLoading, mounted]);

  useWebSocket(user?.email);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({ email, password });
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    plan = "free",
  ): Promise<boolean> => {
    try {
      await registerMutation.mutateAsync({
        name,
        email,
        password,
        confirmPassword: password,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    
    // Limpar estado local imediatamente
    setUser(null);
    
    // Executar logout no backend e limpar cookies
    logoutMutation.mutate();
    
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        isLoading:
          isLoading || loginMutation.isPending || registerMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
