"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { 
  getCommunityPosts, 
  getCommunityPostById, 
  createCommunityPost, 
  updateCommunityPost, 
  deleteCommunityPost,
  incrementPostViews,
  likeCommunityPost
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
    queryFn: async () => {
      const result = await getCommunityPostById(id);
      return result;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 1,
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
    mutationFn: async (postId: string | number) => {
      return await likeCommunityPost(postId.toString())
    },
    onSuccess: (data, variables) => {
      // Invalidar queries de posts
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false 
      })
      
      // Invalidar query específica do post
      queryClient.invalidateQueries({ queryKey: [...queryKeys.community.post(variables)] })
      
      // Atualizar o estado local para refletir o like
      queryClient.setQueryData(
        queryKeys.community.posts,
        (oldData: any) => {
          if (!oldData?.data) return oldData
          
          return {
            ...oldData,
            data: oldData.data.map((post: any) => {
              if (post.id === variables) {
                return {
                  ...post,
                  likes_count: data.likes_count,
                  user_is_liked: data.user_is_liked || []
                }
              }
              return post
            })
          }
        }
      )
      
      toast.success("Post curtido com sucesso!")
    },
    onError: (error: any) => {
      toast.error("Erro ao curtir post")
      console.error("Error liking community post:", error)
    },
  })
} 

export function useIncrementPostViews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: string | number) => {
      return await incrementPostViews(postId.toString())
    },
    onSuccess: (data, variables) => {
      // Invalidar queries de posts
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false 
      })
      
      // Invalidar query específica do post
      queryClient.invalidateQueries({ queryKey: [...queryKeys.community.post(variables)] })
    },
    onError: (error: any) => {
      console.error("Error incrementing post views:", error)
    },
  })
} 