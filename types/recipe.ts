export interface Recipe {
  id: string
  title: string
  description: string
  image?: string
  time: string
  servings: string
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  ingredients: string[]
  instructions: string[]
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

export interface CreateRecipeData {
  title: string
  description: string
  image?: string
  time: string
  servings: string
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  ingredients: string[]
  instructions: string[]
  nutrition?: {
    calories: number
    protein: string
    carbs: string
    fat: string
  }
  isPublic: boolean
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