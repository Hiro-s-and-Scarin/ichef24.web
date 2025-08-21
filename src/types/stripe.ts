export interface StripePrice {
  id: string;
  currency: string;
  unit_amount: number;
  unit_amount_decimal: string;
  recurring?: {
    interval: string;
    interval_count: number;
  };
  type: string;
  active: boolean;
  created: number;
  metadata: Record<string, any>;
}

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  images: string[];
  metadata: Record<string, any>;
  created: number;
  updated: number;
  prices: StripePrice[];
}

export interface StripeProductsResponse {
  success: boolean;
  data: StripeProduct[];
  message: string;
}

