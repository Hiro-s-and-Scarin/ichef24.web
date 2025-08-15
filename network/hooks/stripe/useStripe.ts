"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { createPayment, CreatePaymentRequest } from "@/network/actions/stripe"
import { queryKeys } from "@/lib/query-keys"

export function useCreatePayment() {
  return useMutation({
    mutationFn: async (paymentData: CreatePaymentRequest) => {
      return await createPayment(paymentData)
    },
    onSuccess: (data) => {
      toast.success("Pagamento criado com sucesso!")
      console.log("Payment created:", data)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao criar pagamento")
      console.error("Error creating payment:", error)
    },
  })
} 