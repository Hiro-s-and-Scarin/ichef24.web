import { api } from "@/lib/api/api"
import { CommunityPost, CreateCommunityPostData, UpdateCommunityPostData } from "@/types/community"

export async function getCommunityPosts(params: { page?: number; limit?: number } = {}): Promise<{ data: CommunityPost[]; totalPages: number; currentPage: number; total: number }> {
  const { data } = await api.get("/community-posts", { params })
  return data
}

export async function getCommunityPostById(id: string): Promise<CommunityPost> {
  const { data } = await api.get(`/community-posts/${id}`)
  return data.data || data
}

export async function createCommunityPost({ recipe_id, ...body }: CreateCommunityPostData): Promise<CommunityPost> {
  const { data } = await api.post("/community-posts", { ...body, recipe_id: recipe_id ? +recipe_id : undefined })
  return data.data
}

export async function updateCommunityPost(id: string, body: UpdateCommunityPostData): Promise<CommunityPost> {
  const { data } = await api.put(`/community-posts/${id}`, body)
  return data.data
}

export async function deleteCommunityPost(id: string): Promise<{ message: string }> {
  const { data } = await api.delete(`/community-posts/${id}`)
  return data
}

export async function incrementPostViews(id: string): Promise<CommunityPost> {
  const { data } = await api.patch(`/community-posts/${id}/increment-views`)
  return data.data
}

export async function likeCommunityPost(id: string): Promise<CommunityPost> {
  const { data } = await api.post(`/community-posts/${id}/like`)
  return data.data || data
} 