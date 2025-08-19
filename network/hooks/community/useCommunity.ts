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
import { api } from "@/lib/api/api"
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
    queryKey: [...queryKeys.community.post(id)],
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
    onSuccess: (data) => {
      // Invalidar TODAS as queries de posts (com e sem parâmetros)
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false // Isso invalida todas as queries que começam com ["community", "posts"]
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.postComments })
      
      // Se o post criado tem ID, invalidar também a query individual
      if (data && data.id) {
        queryClient.invalidateQueries({ queryKey: [...queryKeys.community.post(data.id.toString())] })
      }
      
      // Forçar refetch imediato para mostrar o novo post
      queryClient.refetchQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false 
      })
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
      queryClient.invalidateQueries({ queryKey: [...queryKeys.community.post(variables.id)] })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false 
      })
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
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false 
      })
      toast.success("Post deletado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao deletar post")
      console.error("Error deleting community post:", error)
    },
  })
}

// Hooks para comentários de posts
export function usePostComments(postId: string | number) {
  return useQuery({
    queryKey: [...queryKeys.community.postComments, postId],
    queryFn: async () => {
      // Usar a API real para buscar comentários
      const { data } = await api.get(`/post-chat/post/${postId}`)
      return data
    },
    enabled: !!postId,
    staleTime: 1000 * 60 * 2, // Comentários devem ser mais frescos
  })
}

export function useCreatePostComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string | number; content: string }) => {
      // Usar a API real para criar comentário
      const { data } = await api.post(`/post-chat/post/${postId}`, {
        message_type: 'USER',
        content,
      })
      return data
    },
    onSuccess: (data, variables) => {
      // Invalidar queries de comentários
      queryClient.invalidateQueries({ queryKey: [...queryKeys.community.postComments, variables.postId] })
      
      // Invalidar queries de posts
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false 
      })
      queryClient.invalidateQueries({ queryKey: [...queryKeys.community.post(variables.postId)] })
      
      // Forçar refetch imediato para atualização em tempo real
      queryClient.refetchQueries({ queryKey: [...queryKeys.community.postComments, variables.postId] })
      queryClient.refetchQueries({ queryKey: [...queryKeys.community.post(variables.postId)] })
      
      toast.success("Comentário adicionado com sucesso!")
    },
    onError: (error: any) => {
      toast.error("Erro ao adicionar comentário")
      console.error("Error creating post comment:", error)
    },
  })
}

export function useLikeCommunityPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string | number; isLiked: boolean }) => {
      // Buscar o post atual para obter o likes_count atual
      const currentPost = await getCommunityPostById(postId.toString())
      const currentLikes = currentPost.likes_count || 0
      
      // Lógica corrigida:
      // - Se isLiked = true (usuário quer curtir), incrementa
      // - Se isLiked = false (usuário quer descurtir), decrementa
      const newLikesCount = isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
      
      // Atualizar o post usando o endpoint PUT existente
      const result = await updateCommunityPost(postId.toString(), {
        likes_count: newLikesCount
      })
      
      return result
    },
    onSuccess: (data, variables) => {
      const action = variables.isLiked ? 'curtido' : 'descurtido'
      
      // Invalidar TODAS as queries de posts (com e sem parâmetros)
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false 
      })
      queryClient.invalidateQueries({ queryKey: [...queryKeys.community.post(variables.postId)] })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.postComments })
      
      // Forçar refetch imediato para mostrar contagem atualizada
      queryClient.refetchQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false 
      })
      queryClient.refetchQueries({ queryKey: [...queryKeys.community.post(variables.postId)] })
      
      toast.success(`Post ${action}!`)
    },
    onError: (error: any) => {
      toast.error("Erro ao curtir/descurtir post")
      console.error("Error liking/unliking post:", error)
    },
  })
} 