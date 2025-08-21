export interface ChatSession {
  id: string | number;
  user_id: string | number;
  session_token: string;
  title?: string;
  ai_model_version?: string;
  total_messages: number;
  total_tokens_used: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string | number;
    name: string;
    avatar_url?: string;
  };
}

export interface ChatMessage {
  id: string | number;
  session_id: string | number;
  user_id: string | number;
  message_type: "USER" | "AI" | "SYSTEM";
  content: string;
  tokens_used: number;
  recipe_generated_id?: string | number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  user?: {
    id: string | number;
    name: string;
    avatar_url?: string;
  };
  recipe_generated?: {
    id: string | number;
    title: string;
    image_url?: string;
  };
}

export interface CreateChatSessionData {
  title?: string;
  ai_model_version?: string;
}

export interface CreateChatMessageData {
  message_type: "USER" | "AI" | "SYSTEM";
  content: string;
  tokens_used?: number;
  recipe_generated_id?: string | number;
  metadata?: Record<string, unknown>;
}
