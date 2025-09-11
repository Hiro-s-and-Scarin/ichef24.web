"use client";

import { useGetUserPlanStatus } from "@/network/hooks/plans/usePlans";

export function usePlanAccess() {
  const { data: userPlanData, isLoading } = useGetUserPlanStatus();
  
  // Se não tem plano ou está carregando, assume plano free
  const userPlan = userPlanData?.data;
  const planType = userPlan?.plan_type || "free";
  
  // Verifica se tem acesso ao "Livro de Receitas" (apenas planos pagos)
  const hasRecipeBookAccess = planType === "chef" || planType === "master";
  
  // Verifica se é plano free
  const isFreePlan = planType === "free";
  
  return {
    planType,
    hasRecipeBookAccess,
    isFreePlan,
    isLoading,
    userPlan
  };
}
