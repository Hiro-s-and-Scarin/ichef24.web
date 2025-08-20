import { api } from "@/lib/api/api"
import { ChatSession, ChatMessage, CreateChatSessionData, CreateChatMessageData } from "@/types/chat"

export async function getChatSessions(): Promise<{ data: ChatSession[] }> {
  const { data } = await api.get("/chat-sessions/user")
  return data
}

export async function getChatSessionByToken(token: string): Promise<ChatSession> {
  const { data } = await api.get(`/chat-sessions/token/${token}`)
  return data.data
}

export async function createChatSession(body: CreateChatSessionData): Promise<ChatSession> {
  const { data } = await api.post("/chat-sessions", body)
  return data.data
}

export async function updateChatSession(id: string | number, body: Partial<CreateChatSessionData>): Promise<ChatSession> {
  const { data } = await api.put(`/chat-sessions/${id}`, body)
  return data.data
}

export async function deleteChatSession(id: string | number): Promise<{ message: string }> {
  const { data } = await api.delete(`/chat-sessions/${id}`)
  return data
}

export async function getChatMessagesBySession(sessionId: string | number): Promise<{ data: ChatMessage[] }> {
  const { data } = await api.get(`/chat-messages/session/${sessionId}`)
  return data
}

export async function createChatMessage(sessionId: string | number, body: CreateChatMessageData): Promise<ChatMessage> {
  const { data } = await api.post(`/chat-messages/session/${sessionId}`, body)
  return data.data
}

export async function getChatMessagesByUser(): Promise<{ data: ChatMessage[] }> {
  const { data } = await api.get("/chat-messages/user")
  return data
}

export async function deleteChatMessage(id: string | number): Promise<{ message: string }> {
  const { data } = await api.delete(`/chat-messages/${id}`)
  return data
} 