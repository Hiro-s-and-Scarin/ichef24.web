"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { 
  getAllUsers, 
  getUserById, 
  getCurrentUser,
  updateUser, 
  toggleUserStatus, 
  activeUser, 
  deleteUser 
} from "@/network/actions/users/actionUsers"
import { UpdateUserData } from "@/types/user"
import { queryKeys } from "@/lib/config/query-keys"

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.users.me,
    queryFn: async () => await getCurrentUser(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUsers(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: [...queryKeys.users.all, params],
    queryFn: async () => await getAllUsers(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.one(id),
    queryFn: async () => await getUserById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdateUserData }) => {
      return await updateUser(id, body)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.one(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topChefs })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts, exact: false })
      toast.success("Usuário atualizado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar usuário")
    },
  })
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await toggleUserStatus(id)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.one(variables) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      toast.success("Status do usuário alterado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao alterar status do usuário")
    },
  })
}

export function useActiveUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: { is_active: boolean } }) => {
      return await activeUser(id, body)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.one(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      toast.success("Usuário ativado/desativado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao alterar status do usuário")
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteUser(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      toast.success("Usuário deletado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao deletar usuário")
      console.error("Error deleting user:", error)
    },
  })
}