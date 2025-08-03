export const queryKeys = {
  auth: {
    me: ["me"] as const,
    session: ["auth", "session"] as const,
  },
  recipes: {
    all: ["recipes"] as const,
    list: (params?: any) => ["recipes", "list", params] as const,
    detail: (id: string) => ["recipes", "detail", id] as const,
    favorites: (userId?: string) => ["recipes", "favorites", userId] as const,
    history: (userId?: string) => ["recipes", "history", userId] as const,
    search: (query: string) => ["recipes", "search", query] as const,
    tags: ["recipes", "tags"] as const,
    categories: ["recipes", "categories"] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", "detail", id] as const,
    profile: (id: string) => ["users", "profile", id] as const,
    preferences: (id: string) => ["users", "preferences", id] as const,
  },
  plans: {
    all: ["plans"] as const,
    active: (userId: string) => ["plans", "active", userId] as const,
    billing: (userId: string) => ["plans", "billing", userId] as const,
  },
  ai: {
    suggestions: (prompt: string) => ["ai", "suggestions", prompt] as const,
    generate: (type: string, params?: any) => ["ai", "generate", type, params] as const,
  },
} as const

export type QueryKeys = typeof queryKeys