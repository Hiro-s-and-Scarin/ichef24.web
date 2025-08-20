export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  is_active: boolean;
  email_verified: boolean;
  createdAt: string;
  updatedAt: string;
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
