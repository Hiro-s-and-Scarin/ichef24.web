import { api } from "@/lib/api/api"

export async function searchImageByTitle(title: string): Promise<any> {
  const { data } = await api.get(`/recipe-images/search-by-title?title=${encodeURIComponent(title)}`)
  return data
}
