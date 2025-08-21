export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
    session: ["auth", "session"] as const,
  },
  recipes: {
    all: ["recipes"] as const,
    one: (id: string | number) => ["recipes", id] as const,
    favorites: ["recipes", "favorites"] as const,
    my: ["recipes", "my"] as const,
    user: ["recipes", "user"] as const,
    top: ["recipes", "top"] as const,
    tags: ["recipes", "tags"] as const,
    categories: ["recipes", "categories"] as const,
  },
  users: {
    all: ["users"] as const,
    one: (id: string | number) => ["users", id] as const,
    me: ["users", "me"] as const,
  },
  community: {
    posts: ["community", "posts"] as const,
    post: (id: string | number) => ["community", "post", id] as const,
    postComments: (postId: string | number) =>
      ["community", "postComments", postId] as const,
    postChat: (postId: string | number) => ["post-chat", postId] as const,
    postMessages: (postId: string | number) =>
      ["post-messages", postId] as const,
    allPostComments: ["community-post-comments"] as const,
    topChefs: ["top-chefs"] as const,
    topRecipes: ["top-recipes"] as const,
  },
  chat: {
    sessions: ["chat", "sessions"] as const,
    session: (token: string | number) => ["chat", "session", token] as const,
    messages: ["chat", "messages"] as const,
  },
  plans: {
    all: ["plans"] as const,
    active: (userId: string | number) => ["plans", "active", userId] as const,
    billing: (userId: string | number) => ["plans", "active", userId] as const,
  },
  ai: {
    suggestions: (prompt: string) => ["ai", "suggestions", prompt] as const,
    generate: (type: string, params?: any) =>
      ["ai", "generate", type, params] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;


