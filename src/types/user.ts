export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  is_active: boolean;
  email_verified: boolean;
  daily_recipe_counter?: number;
  last_recipe_reset_date?: string;
  createdAt: string;
  updatedAt: string;
  plan?: {
    max_generate_recipe_per_day: number;
    max_manual_recipe_per_day: number;
    max_favorite_recipe: number;
    max_history_recipe: number;
    plan_type: string;
  };
}

export interface UpdateUserData {
  name?: string;
  avatar_url?: string;
  is_active?: boolean;
  email_verified?: boolean;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  avatar_url?: string;
  is_active?: boolean;
  email_verified?: boolean;
}
