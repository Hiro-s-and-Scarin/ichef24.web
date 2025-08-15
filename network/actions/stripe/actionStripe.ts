import { api } from "@/lib/api"

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