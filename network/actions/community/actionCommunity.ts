import { api } from "@/lib/api"
import { CommunityPost, CreateCommunityPostData, UpdateCommunityPostData } from "@/types/community"

export async function getCommunityPosts(params: { page?: number; limit?: number } = {}): Promise<{ data: CommunityPost[]; pagination: any }> {
  const { data } = await api.get("/community-posts", { params })
  return data
}

export async function getCommunityPostById(id: string): Promise<CommunityPost> {
  const { data } = await api.get(`/community-posts/${id}`)
  return data.data
}

export async function createCommunityPost(body: CreateCommunityPostData): Promise<CommunityPost> {
  const { data } = await api.post("/community-posts", body)
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