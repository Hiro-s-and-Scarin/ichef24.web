export interface CommunityPost {
  id: number
  user_id: number
  recipe_id?: number
  title?: string
  content: string
  image_url?: string
  difficulty_level?: 'Fácil' | 'Intermediário' | 'Avançado'
  recipe_tags?: string[]
  likes_count: number
  comments_count: number
  shares_count: number
  is_featured: boolean
  is_active: boolean
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    name: string
    email?: string
    avatar_url?: string
  }
  recipe?: {
    id: number
    title: string
    image_url?: string
    description?: string
  }
}

export interface CreateCommunityPostData {
  title?: string
  content: string
  image_url?: string
  difficulty_level?: 'Fácil' | 'Intermediário' | 'Avançado'
  recipe_tags?: string[]
  recipe_id?: string
}

export interface UpdateCommunityPostData {
  title?: string
  content?: string
  image_url?: string
  difficulty_level?: 'Fácil' | 'Intermediário' | 'Avançado'
  recipe_tags?: string[]
  recipe_id?: string
} 