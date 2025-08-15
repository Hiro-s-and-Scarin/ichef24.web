"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { 
  getCommunityPosts, 
  getCommunityPostById, 
  createCommunityPost, 
  updateCommunityPost, 
  deleteCommunityPost 
} from "@/network/actions/community/actionCommunity"
import { CreateCommunityPostData, UpdateCommunityPostData } from "@/types/community"
import { queryKeys } from "@/lib/config/query-keys"

export function useCommunityPosts(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: [...queryKeys.community.posts, params],
    queryFn: async () => await getCommunityPosts(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCommunityPost(id: string) {
  return useQuery({
    queryKey: [...queryKeys.community.post, id],
    queryFn: async () => await getCommunityPostById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateCommunityPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CreateCommunityPostData) => {
      return await createCommunityPost(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts })
      toast.success("Post criado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao criar post")
      console.error("Error creating community post:", error)
    },
  })
}

export function useUpdateCommunityPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdateCommunityPostData }) => {
      return await updateCommunityPost(id, body)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.community.post, variables.id] })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts })
      toast.success("Post atualizado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar post")
      console.error("Error updating community post:", error)
    },
  })
}

export function useDeleteCommunityPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteCommunityPost(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts })
      toast.success("Post deletado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao deletar post")
      console.error("Error deleting community post:", error)
    },
  })
} 