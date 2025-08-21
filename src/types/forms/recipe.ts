export interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  image_url?: string;
  tags?: string[];
  difficulty_level?: "Fácil" | "Intermediário" | "Avançado";
  prep_time?: number;
  cook_time?: number;
  servings?: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeStep[];
  image_url?: string;
  tags?: string[];
  difficulty_level?: "Fácil" | "Intermediário" | "Avançado";
  prep_time?: number;
  cook_time?: number;
  servings?: number;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  unit?: string;
}

export interface RecipeStep {
  step: number;
  instruction: string;
  time?: number;
}



