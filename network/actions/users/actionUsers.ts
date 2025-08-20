import { api } from "@/lib/api/api"
import { User, UpdateUserData } from "@/types/user"

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get("/users/me")
  return data.data
}

export async function getAllUsers(params: { page?: number; limit?: number } = {}): Promise<{ data: User[]; pagination: any }> {
  const { data } = await api.get("/users", { params })
  return data
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await api.get(`/users/${id}`)
  return data.data
}

export async function updateUser(id: string, body: UpdateUserData): Promise<User> {
  const { data } = await api.put(`/users/${id}`, body)
  return data.data
}

export async function toggleUserStatus(id: string): Promise<User> {
  const { data } = await api.patch(`/users/${id}/status`)
  return data.data
}

export async function activeUser(id: string, body: { is_active: boolean }): Promise<User> {
  const { data } = await api.patch(`/users/${id}`, body)
  return data.data
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
  const { data } = await api.get("/community-posts/top-chefs")
  return data.data || data
}

export async function getTrendingPosts(): Promise<any[]> {
  const { data } = await api.get("/community/trending")
  return data.posts
}

export async function postCommunityMessage(body: { message: string; postId?: string }): Promise<{ message: string }> {
  const { data } = await api.post("/community/messages", body)
  return data
}