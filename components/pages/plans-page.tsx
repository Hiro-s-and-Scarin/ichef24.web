"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Check, Sparkles, Crown, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

import { useGetPlans } from "@/network/hooks/plans/usePlans"
import { Plan } from "@/types"
import { useCurrencyFormatter } from "@/lib/currency"

export function PlansPageContent() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  // TanStack Query hooks
  const { data: plansData, isLoading } = useGetPlans()
  
  // Hook para formatação de moeda baseada no idioma
  const { formatCurrency } = useCurrencyFormatter()

  // Função para obter ícone baseado no tipo de plano
  const getPlanIcon = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'free':
        return <ChefHat className="w-8 h-8" />
      case 'basic':
        return <Sparkles className="w-8 h-8" />
      case 'premium':
        return <Crown className="w-8 h-8" />
      case 'enterprise':
        return <Zap className="w-8 h-8" />
      default:
        return <ChefHat className="w-8 h-8" />
    }
  }

  // Função para obter cor baseada no tipo de plano
  const getPlanColor = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'free':
        return "from-gray-500 to-gray-600"
      case 'basic':
        return "from-[#f54703] to-[#ff7518]"
      case 'premium':
        return "from-purple-500 to-purple-600"
      case 'enterprise':
        return "from-blue-500 to-blue-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  // Função para obter features baseadas no tipo de plano
  const getPlanFeatures = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'free':
        return [
          "Até 5 receitas por dia",
          "Geração básica de receitas",
          "Acesso à comunidade",
          "Suporte por email",
        ]
      case 'basic':
        return [
          "Receitas ilimitadas",
          "Geração avançada de receitas",
          "Receitas personalizadas",
          "Histórico completo",
          "Filtros avançados",
          "Suporte prioritário",
        ]
      case 'premium':
        return [
          "Todas as funcionalidades do Básico",
          "IA avançada com análise nutricional",
          "Planejamento semanal de refeições",
          "Lista de compras automática",
          "Acesso a receitas exclusivas",
          "Suporte 24/7",
        ]
      case 'enterprise':
        return [
          "Todas as funcionalidades do Premium",
          "API de integração",
          "Suporte dedicado",
          "Relatórios avançados",
          "Múltiplos usuários",
        ]
      default:
        return []
    }
  }

  // Use real data from API
  const plans = plansData || []

  const handleSubscribe = async (plan: Plan) => {
    // Redirecionar para checkout com dados do plano usando stripe_subscription_id
    router.push(`/checkout?planId=${plan.stripe_subscription_id}&planName=${plan.name}&price=${plan.amount}&billingCycle=${plan.billing_cycle}`)
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
              Escolha seu{" "}
              <span className="bg-gradient-to-r from-[#f54703] to-[#ff7518] bg-clip-text text-transparent">Plano</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Encontre o plano perfeito para sua jornada culinária. Comece grátis e evolua conforme suas necessidades.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-lg ${billingCycle === "monthly" ? "text-gray-800 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>Mensal</span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                className={`relative w-16 h-8 rounded-full transition-colors ${
                  billingCycle === "yearly" ? "bg-[#ff7518]" : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    billingCycle === "yearly" ? "translate-x-9" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-lg ${billingCycle === "yearly" ? "text-gray-800 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>Anual</span>
              {billingCycle === "yearly" && (
                <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">Economize 20%</Badge>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Carregando planos...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Plans Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {plans.map((plan: Plan) => (
                  <Card
                    key={plan.id}
                    className={`relative bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-105 ${
                      plan.plan_type === 'basic' ? "border-[#ff7518]/50 shadow-2xl shadow-[#ff7518]/20" : ""
                    }`}
                  >
                    {plan.plan_type === 'basic' && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#f54703] to-[#ff7518] text-white text-center py-2 text-sm font-medium">
                        ⭐ Mais Popular
                      </div>
                    )}

                    <CardHeader className={`text-center ${plan.plan_type === 'basic' ? "pt-12" : "pt-8"}`}>
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${getPlanColor(plan.plan_type)} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                      >
                        {getPlanIcon(plan.plan_type)}
                      </div>
                      <CardTitle className="text-2xl text-gray-800 dark:text-white">{plan.name}</CardTitle>
                      <p className="text-gray-600 dark:text-gray-300">
                        {plan.plan_type === 'free' ? 'Para começar' : 
                         plan.plan_type === 'basic' ? 'Para cozinheiros que querem mais' :
                         plan.plan_type === 'premium' ? 'Para especialistas' : 'Para empresas'}
                      </p>

                      <div className="py-6">
                        <div className="text-4xl font-bold text-gray-800 dark:text-white">
                          {billingCycle === "monthly"
                            ? formatCurrency(plan.amount)
                            : formatCurrency(plan.amount * 12 * 0.8)}
                          {plan.amount > 0 && <span className="text-lg text-gray-500 dark:text-gray-400">/mês</span>}
                        </div>
                        {billingCycle === "yearly" && plan.amount > 0 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            ou {formatCurrency(plan.amount * 12 * 0.8)} por ano (20% off)
                          </p>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {getPlanFeatures(plan.plan_type).map((feature: string, featureIndex: number) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full py-6 text-lg font-medium ${
                          plan.plan_type === 'basic'
                            ? "bg-gradient-to-r from-[#f54703] to-[#ff7518] hover:from-[#ff7518] hover:to-[#f54703] text-white border-0"
                            : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 bg-transparent"
                        }`}
                        variant={plan.plan_type === 'basic' ? "default" : "outline"}
                        onClick={() => handleSubscribe(plan)}
                      >
                        {plan.amount === 0 ? "Começar Grátis" : "Assinar Plano"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}