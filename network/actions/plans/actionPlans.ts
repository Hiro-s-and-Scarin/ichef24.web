import { Plan, Subscription, CreatePlanRequest, CreatePlanResponse } from "@/src/types"
import { api } from "@/lib/api/api"

export async function getPlans(): Promise<Plan[]> {
  const { data } = await api.get("/plans")
  return data.plans
}

export async function getPlanById(id: string): Promise<Plan> {
  const { data } = await api.get(`/plans/${id}`)
  return data.plan
}

export async function createPlan(planData: CreatePlanRequest): Promise<CreatePlanResponse> {
  const { data } = await api.post("/plans", planData)
  return data
}

export async function createFreePlan(planData: CreatePlanRequest): Promise<CreatePlanResponse> {
  const { data } = await api.post("/plans/free", planData)
  return data
}

export async function postSubscribeToPlan(planId: string, paymentMethodId?: string): Promise<Subscription> {
  const { data } = await api.post("/stripe/subscribe", {
    planId,
    paymentMethodId,
  })
  return data.subscription
}

export async function putChangeSubscription(subscriptionId: string, planId: string): Promise<Subscription> {
  const { data } = await api.put(`/subscriptions/${subscriptionId}`, {
    planId,
  })
  return data.subscription
}

export async function postCancelSubscription(subscriptionId: string): Promise<{ message: string }> {
  const { data } = await api.post(`/subscriptions/${subscriptionId}/cancel`)
  return data
}

export async function postReactivateSubscription(subscriptionId: string): Promise<Subscription> {
  const { data } = await api.post(`/subscriptions/${subscriptionId}/reactivate`)
  return data.subscription
}

export async function getBillingHistory(userId: string): Promise<{
  data: Array<{
    id: string
    amount: number
    currency: string
    status: string
    description: string
    createdAt: string
  }>
}> {
  const { data } = await api.get(`/users/${userId}/billing-history`)
  return data
}