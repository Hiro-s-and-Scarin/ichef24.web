export interface PostFormData {
  title: string
  content: string
  image_url?: string
  difficulty_level?: "Fácil" | "Intermediário" | "Avançado"
  recipe_tags?: string[]
  recipe_id?: string
}

export interface CommentFormData {
  content: string
}
