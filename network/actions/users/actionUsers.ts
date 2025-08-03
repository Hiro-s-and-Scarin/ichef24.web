import { api } from "@/lib/api"
import { User } from "@/types"

export async function getUsers(params: { search?: string; page?: number; limit?: number } = {}): Promise<{
  data: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}> {
  const { data } = await api.get("/users", { params })
  return data
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await api.get(`/users/${id}`)
  return data.user
}

export async function putUser(id: string, body: Partial<User>): Promise<User> {
  const { data } = await api.put(`/users/${id}`, body)
  return data.user
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  const { data } = await api.delete(`/users/${id}`)
  return data
}

export async function getUserPreferences(userId: string): Promise<User["preferences"]> {
  const { data } = await api.get(`/users/${userId}/preferences`)
  return data.preferences
}

export async function putUserPreferences(userId: string, preferences: Partial<User["preferences"]>): Promise<User["preferences"]> {
  const { data } = await api.put(`/users/${userId}/preferences`, preferences)
  return data.preferences
}

// Community actions
export async function getCommunityPosts(params: { 
  page?: number; 
  limit?: number; 
  search?: string; 
  tab?: string 
} = {}): Promise<{
  data: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}> {
  const { data } = await api.get("/community/posts", { params })
  return data
}

export async function getTopChefs(): Promise<any[]> {
  const { data } = await api.get("/community/top-chefs")
  return data.chefs
}

export async function getTrendingPosts(): Promise<any[]> {
  const { data } = await api.get("/community/trending")
  return data.posts
}

export async function postCommunityMessage(body: { message: string; postId?: string }): Promise<{ message: string }> {
  const { data } = await api.post("/community/messages", body)
  return data
}