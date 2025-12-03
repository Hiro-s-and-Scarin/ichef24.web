import { api } from "@/lib/api/api";
import { StripeProductsResponse } from "@/src/types";

export interface CreatePaymentRequest {
  productId: string // Este é o stripe_subscription_id do backend
  paymentMethodType: 'card' | 'pix'
  paymentMethod: string
  email: string
}

export interface PaymentResponse {
  id: string
  status: string
  client_secret?: string
  amount: number
  currency: string
  metadata: any
}

export async function createPayment(paymentData: CreatePaymentRequest): Promise<PaymentResponse> {
  // paymentData.productId contém o stripe_subscription_id do backend
  const { data } = await api.post("/stripe/payment", paymentData)
  return data.data // O backend retorna { data: paymentIntent }
}

// Função para confirmar pagamento se necessário no futuro
// export async function confirmPayment(paymentIntentId: string): Promise<PaymentResponse> {
//   const { data } = await api.post(`/stripe/confirm-payment/${paymentIntentId}`)
//   return data
// } 

export async function getStripeProducts(currency?: string, billingCycle?: string): Promise<StripeProductsResponse> {
  const params = new URLSearchParams();
  if (currency) params.append('currency', currency);
  if (billingCycle) params.append('billingCycle', billingCycle);
  
  const { data } = await api.get(`/stripe/products?${params.toString()}`);
  return data;
}

export interface CreateCheckoutRequest {
  priceId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutResponse {
  success: boolean;
  data: {
    url: string;
    sessionId: string;
  };
  message: string;
}

export async function createStripeCheckout(checkoutData: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
  const { data } = await api.post("/stripe/checkout", checkoutData);
  return data;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  data: {
    success: boolean;
    message: string;
    cancel_at_period_end: boolean;
    current_period_end: string | null;
    canceled_at: string | null;
    status: string;
  };
  message: string;
}

export async function cancelSubscription(): Promise<CancelSubscriptionResponse> {
  const { data } = await api.post("/stripe/subscription/cancel");
  return data;
} 