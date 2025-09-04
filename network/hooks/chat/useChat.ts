"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { 
  getChatSessions, 
  getChatSessionByToken, 
  createChatSession, 
  updateChatSession, 
  deleteChatSession,
  getChatMessagesBySession,
  createChatMessage,
  getChatMessagesByUser,
  deleteChatMessage
} from "@/network/actions/chat/actionChat"
import { CreateChatSessionData, CreateChatMessageData } from "@/types/chat"
import { queryKeys } from "@/lib/config/query-keys"

export function useChatSessions() {
  return useQuery({
    queryKey: queryKeys.chat.sessions,
    queryFn: async () => await getChatSessions(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useChatSessionByToken(token: string) {
  return useQuery({
    queryKey: [...queryKeys.chat.session, token],
    queryFn: async () => await getChatSessionByToken(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateChatSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CreateChatSessionData) => {
      return await createChatSession(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.sessions })
      toast.success("Sessão de chat criada com sucesso!")
    },
    onError: (error: any) => {
      toast.error("Erro ao criar sessão de chat")
    },
  })
}

export function useUpdateChatSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, body }: { id: string | number; body: Partial<CreateChatSessionData> }) => {
      return await updateChatSession(id, body)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.chat.session, variables.id] })
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.sessions })
      toast.success("Sessão de chat atualizada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar sessão de chat")
    },
  })
}

export function useDeleteChatSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string | number) => {
      return await deleteChatSession(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.sessions })
      toast.success("Sessão de chat deletada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao deletar sessão de chat")
    },
  })
}

export function useChatMessagesBySession(sessionId: string | number) {
  return useQuery({
    queryKey: [...queryKeys.chat.messages, sessionId],
    queryFn: async () => await getChatMessagesBySession(sessionId),
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 1, // Chat messages should be fresh
  })
}

export function useCreateChatMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ sessionId, body }: { sessionId: string | number; body: CreateChatMessageData }) => {
      return await createChatMessage(sessionId, body)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.chat.messages, variables.sessionId] })
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.sessions })
      toast.success("Mensagem enviada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao enviar mensagem")
    },
  })
}

export function useDeleteChatMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string | number) => {
      return await deleteChatMessage(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages })
      toast.success("Mensagem deletada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao deletar mensagem")
    },
  })
} 