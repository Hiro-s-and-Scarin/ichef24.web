"use client"

import { useQuery, useMutation } from "@tanstack/react-query";
import { getStripeProducts, createStripeCheckout } from "@/network/actions/stripe";
import { StripeProductsResponse } from "@/src/types";

export function useCreatePayment() {
  return useMutation({
    mutationFn: createStripeCheckout,
    onSuccess: (data) => {
      console.log("Payment created successfully:", data);
    },
    onError: (error) => {
      console.error("Payment creation failed:", error);
    },
  });
}

export function useGetStripeProducts() {
  return useQuery<StripeProductsResponse>({
    queryKey: ["stripe", "products"],
    queryFn: getStripeProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useCreateStripeCheckout() {
  return useMutation({
    mutationFn: createStripeCheckout,
    onSuccess: (data) => {
      console.log("Checkout session created successfully:", data);
    },
    onError: (error) => {
      console.error("Checkout session creation failed:", error);
    },
  });
} 