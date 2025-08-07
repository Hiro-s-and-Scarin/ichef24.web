export interface Recipe {
  id: string
  title: string
  description: string
  image?: string
  time: string
  servings: string
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  ingredients: Array<{ name: string; amount: string }> // ✅ Compatível com DTO
  instructions: Array<{ step: number; description: string }> // ✅ Compatível com DTO
  nutrition?: {
    calories: number
    protein: string
    carbs: string
    fat: string
  }
  userId: string
  user?: {
    id: string
    name: string
    avatar?: string
  }
  rating?: number
  reviews?: Review[]
  isFavorite?: boolean
  isPublic: boolean
  createdAt: string
  updatedAt: string
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

// ✅ Tipo compatível com o DTO do backend
export interface CreateRecipeData {
  title: string
  description?: string
  ingredients: Array<{ name: string; amount: string }> // ✅ Compatível
  steps: Array<{ step: number; description: string }> // ✅ Compatível
  cooking_time?: number // ✅ Compatível
  servings?: number // ✅ Compatível
  difficulty_level?: number // ✅ Compatível (1-5)
  cuisine_type?: string // ✅ Compatível
  tags?: string[] // ✅ Compatível
  image_url?: string // ✅ Compatível
  is_ai_generated?: boolean // ✅ Compatível
  ai_prompt?: string // ✅ Compatível
  ai_model_version?: string // ✅ Compatível
  is_public?: boolean // ✅ Compatível
}

export interface AIRecipeRequest {
  prompt: string
  preferences?: {
    diet?: string[]
    allergies?: string[]
    time?: string
    difficulty?: string
    servings?: number
  }
}