export interface Recipe {
  id: string | number
  user_id: string | number
  title: string
  description?: string
  ingredients: Array<{ name: string; amount: string }>
  steps: Array<{ step: number; description: string }>
  cooking_time?: number
  servings?: number
  difficulty_level?: number // 1-5
  cuisine_type?: string
  tags?: string[]
  image_url?: string
  is_ai_generated: boolean
  ai_prompt?: string
  ai_model_version?: string
  is_public: boolean
  views_count: number
  likes_count: number
  createdAt: string
  updatedAt: string
  user?: {
    id: string | number
    name: string
    avatar_url?: string
  }
}

export interface Review {
  id: string
  rating: number
  comment?: string
  userId: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  recipeId: string
  createdAt: string
}

export interface RecipeParams {
  page?: number
  limit?: number
  search?: string
  tags?: string[]
  difficulty?: string[]
  time?: string
  sortBy?: "newest" | "oldest" | "rating" | "title"
  userId?: string
}

export interface RecipeResponse {
  data: Recipe[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateRecipeData {
  title: string
  description?: string
  ingredients: Array<{ name: string; amount: string }>
  steps: Array<{ step: number; description: string }>
  cooking_time?: number
  servings?: number
  difficulty_level?: number
  cuisine_type?: string
  tags?: string[]
  image_url?: string
  is_ai_generated?: boolean
  ai_prompt?: string
  ai_model_version?: string
  is_public?: boolean
}

export interface AIRecipeRequest {
  first_message: string
  new_recipe?: string
  old_recipe?: string
}