"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getPlans,
  getPlanById,
  postSubscribeToPlan,
  putChangeSubscription,
  postCancelSubscription,
  postReactivateSubscription,
  getBillingHistory,
  createPlan,
  createFreePlan
} from "@/network/actions/plans/actionPlans"
import { getFreePlanStatus, getUserPlanStatus } from "@/network/actions/plans"
import { CreatePlanRequest } from "@/src/types"
import { queryKeys } from "@/lib/config/query-keys"

export function useGetPlans() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.plans.all,
    queryFn: async () => await getPlans(),
    retry: 0,
  })

  return {
    data,
    isLoading,
  }
}

export function useGetPlanById(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["plans", "detail", id],
    queryFn: async () => await getPlanById(id),
    enabled: !!id,
    retry: 0,
  })

  return {
    data,
    isLoading,
  }
}


export function useGetBillingHistory(userId: string) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.plans.billing(userId),
    queryFn: async () => await getBillingHistory(userId),
    enabled: !!userId,
    retry: 0,
  })

  return {
    data: data?.data,
    isLoading,
  }
}

export function useSubscribeToPlan() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async ({ planId, paymentMethodId }: { planId: string; paymentMethodId?: string }) => {
      return await postSubscribeToPlan(planId, paymentMethodId)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
      toast.success("Plano assinado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao assinar plano")
      console.error("Error subscribing to plan:", error)
    },
  })

  return mutate
}

export function useChangeSubscription() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async ({ subscriptionId, planId }: { subscriptionId: string; planId: string }) => {
      return await putChangeSubscription(subscriptionId, planId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
      toast.success("Plano alterado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao alterar plano")
      console.error("Error changing subscription:", error)
    },
  })

  return mutate
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (subscriptionId: string) => {
      return await postCancelSubscription(subscriptionId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
      toast.success("Plano cancelado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao cancelar plano")
      console.error("Error cancelling subscription:", error)
    },
  })

  return mutate
}

export function useReactivateSubscription() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (subscriptionId: string) => {
      return await postReactivateSubscription(subscriptionId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
      toast.success("Plano reativado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao reativar plano")
      console.error("Error reactivating subscription:", error)
    },
  })

  return mutate
}

export function useCreateFreePlan() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (planData: CreatePlanRequest) => {
      return await createFreePlan(planData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
      toast.success("Plano gratuito criado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao criar plano gratuito")
      console.error("Error creating free plan:", error)
    },
  })

  return mutate
}

export function useGetFreePlanStatus() {
  return useQuery({
    queryKey: ['plans', 'free-status'],
    queryFn: getFreePlanStatus,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useGetUserPlanStatus() {
  return useQuery({
    queryKey: ['plans', 'user-status'],
    queryFn: getUserPlanStatus,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}