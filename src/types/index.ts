export * from "./auth";
export * from "./recipe";
export * from "./stripe";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "premium" | "admin";
  preferences: {
    theme: "light" | "dark" | "system";
    language: "pt-BR" | "en-US";
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  subscription?: {
    plan: "free" | "pro" | "premium";
    status: "active" | "cancelled" | "expired";
    expiresAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: number;
  user_id?: number;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan_type: "free" | "basic" | "premium" | "enterprise";
  billing_cycle: "monthly" | "yearly" | "one_time";
  amount: number;
  currency: string;
  status: "active" | "inactive" | "cancelled" | "past_due" | "unpaid";
  trial_end?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  name?: string; // Calculado dinamicamente no frontend baseado no plan_type
  features?: string[]; // Calculado dinamicamente no frontend baseado no plan_type
  price?: {
    // Calculado dinamicamente no frontend
    monthly: number;
    yearly: number;
  };
  isPopular?: boolean; // Calculado dinamicamente no frontend
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: Plan;
  status: "active" | "cancelled" | "expired";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export interface CreatePlanRequest {
  plan_type: "free" | "basic" | "premium" | "enterprise";
  billing_cycle: "monthly" | "yearly" | "one_time";
  amount: number;
  currency: string;
  stripe_subscription_id?: string;
}

export interface CreatePlanResponse {
  success: boolean;
  data: Plan;
  message: string;
}
