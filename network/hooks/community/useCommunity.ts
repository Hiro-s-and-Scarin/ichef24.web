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
    queryKey: queryKeys.community.post(id),
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
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.allPostComments })
      
      if (data && data.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.community.post(data.id.toString()) })
      }
      
      queryClient.refetchQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false 
      })
      toast.success("Post criado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao criar post")
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
      queryClient.invalidateQueries({ queryKey: queryKeys.community.post(variables.id) })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false 
      })
      toast.success("Post atualizado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar post")
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
    },
  })
}

export function usePostComments(postId: string | number) {
  return useQuery({
    queryKey: queryKeys.community.postComments(postId),
    queryFn: async () => {
      const { data } = await api.get(`/post-chat/post/${postId}`)
      return data
    },
    enabled: !!postId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  })
}

export function useCreatePostComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string | number; content: string }) => {
      const { data } = await api.post(`/post-chat/post/${postId}`, {
        message_type: 'USER',
        content,
      })
      return data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.postComments(variables.postId) })
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false 
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.post(variables.postId) })
      
      queryClient.invalidateQueries({ queryKey: queryKeys.community.postChat(variables.postId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.postMessages(variables.postId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.allPostComments })
      
      queryClient.refetchQueries({ queryKey: queryKeys.community.postComments(variables.postId) })
      queryClient.refetchQueries({ queryKey: queryKeys.community.post(variables.postId) })
      
      toast.success("Comentário adicionado com sucesso!")
    },
    onError: (error: any) => {
      toast.error("Erro ao adicionar comentário")
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
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false 
      })
      
      queryClient.invalidateQueries({ queryKey: queryKeys.community.post(variables) })
      
      queryClient.invalidateQueries({ queryKey: queryKeys.community.postChat(variables) })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.postComments(variables) })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.postMessages(variables) })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.allPostComments })
      
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topRecipes })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topChefs })
      
      toast.success("Post curtido com sucesso!")
    },
    onError: (error: any) => {
      toast.error("Erro ao curtir post")
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
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.community.posts,
        exact: false 
      })
      
      queryClient.invalidateQueries({ queryKey: queryKeys.community.post(variables) })
    },
    onError: (error: any) => {
    },
  })
} 