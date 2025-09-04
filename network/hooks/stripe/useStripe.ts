"use client"

import { useMutation, useQuery } from "@tanstack/react-query";
import { getStripeProducts, createStripeCheckout } from "@/network/actions/stripe";
import { StripeProductsResponse } from "@/src/types";
import { toast } from "sonner";

export function useCreatePayment() {
  return useMutation({
    mutationFn: createStripeCheckout,
    onSuccess: (data) => {
      toast.success("Pagamento criado com sucesso!")
    },
    onError: (error: any) => {
      toast.error("Erro ao criar pagamento")
    },
  });
}

export function useGetStripeProducts(currency?: string, billingCycle?: string) {
  return useQuery<StripeProductsResponse>({
    queryKey: ["stripe", "products", currency, billingCycle],
    queryFn: () => getStripeProducts(currency, billingCycle),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useCreateStripeCheckout() {
  return useMutation({
    mutationFn: createStripeCheckout,
    onSuccess: (data) => {
      toast.success("Checkout criado com sucesso!")
    },
    onError: (error: any) => {
      toast.error("Erro ao criar checkout")
    },
  });
} 