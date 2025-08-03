"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { 
  getUsers, 
  getUserById, 
  putUser, 
  deleteUser,
  getUserPreferences,
  putUserPreferences,
  getCommunityPosts,
  getTopChefs,
  getTrendingPosts,
  postCommunityMessage
} from "@/network/actions/users/actionUsers"
import { queryKeys } from "@/lib/query-keys"
import { User } from "@/types"

export function useGetUsers(params: { search?: string; page?: number; limit?: number } = {}) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => await getUsers(params),
    retry: 0,
  })

  return {
    data: data?.data,
    isLoading,
  }
}

export function useGetUserById(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => await getUserById(id),
    enabled: !!id,
    retry: 0,
  })

  return {
    data,
    isLoading,
  }
}

export function useGetUserPreferences(userId: string) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users.preferences(userId),
    queryFn: async () => await getUserPreferences(userId),
    enabled: !!userId,
    retry: 0,
  })

  return {
    data,
    isLoading,
  }
}

export function usePutUser(id: string) {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (body: Partial<User>) => {
      return await putUser(id, body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
      toast.success("Usuário atualizado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar usuário")
      console.error("Error updating user:", error)
    },
  })

  return mutate
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (id: string) => {
      return await deleteUser(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      toast.success("Usuário excluído com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao excluir usuário")
      console.error("Error deleting user:", error)
    },
  })

  return mutate
}

export function usePutUserPreferences(userId: string) {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (preferences: Partial<User["preferences"]>) => {
      return await putUserPreferences(userId, preferences)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.preferences(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
      toast.success("Preferências atualizadas com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar preferências")
      console.error("Error updating preferences:", error)
    },
  })

  return mutate
}

// Community hooks
export function useGetCommunityPosts(params: { 
  page?: number; 
  limit?: number; 
  search?: string; 
  tab?: string 
} = {}) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users.community(params),
    queryFn: async () => await getCommunityPosts(params),
    retry: 0,
  })

  return {
    data: data?.data,
    isLoading,
  }
}

export function useGetTopChefs() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users.topChefs,
    queryFn: async () => await getTopChefs(),
    retry: 0,
  })

  return {
    data,
    isLoading,
  }
}

export function useGetTrendingPosts() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users.trending,
    queryFn: async () => await getTrendingPosts(),
    retry: 0,
  })

  return {
    data,
    isLoading,
  }
}

export function usePostCommunityMessage() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (body: { message: string; postId?: string }) => {
      return await postCommunityMessage(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.community() })
      toast.success("Mensagem enviada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao enviar mensagem")
      console.error("Error posting message:", error)
    },
  })

  return mutate
}