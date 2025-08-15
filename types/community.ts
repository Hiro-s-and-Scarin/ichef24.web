export interface CommunityPost {
  id: string
  user_id: string
  recipe_id?: string
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
    id: string
    name: string
    avatar_url?: string
  }
  recipe?: {
    id: string
    title: string
    image_url?: string
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