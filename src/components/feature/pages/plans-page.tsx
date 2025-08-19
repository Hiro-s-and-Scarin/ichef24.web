"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Check, Sparkles, Crown, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslation } from "react-i18next"

import { useGetPlans } from "@/network/hooks/plans/usePlans"
import { useCurrencyFormatter } from "@/lib/utils/currency"
import { Plan } from "@/src/types"

export function PlansPageContent() {
  const { t } = useTranslation()
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
          t('plans.free.features.recipes'),
          t('plans.free.features.generation'),
          t('plans.free.features.access'),
          t('plans.free.features.support'),
        ]
      case 'basic':
        return [
          t('plans.pro.features.recipes'),
          t('plans.pro.features.generation'),
          t('plans.pro.features.personalized'),
          t('plans.pro.features.history'),
          t('plans.pro.features.filters'),
          t('plans.pro.features.support'),
        ]
      case 'premium':
        return [
          t('plans.premium.features.recipes'),
          t('plans.premium.features.ai'),
          t('plans.premium.features.planning'),
          t('plans.premium.features.shopping'),
          t('plans.premium.features.exclusive'),
          t('plans.premium.features.support'),
        ]
      case 'enterprise':
        return [
          t('plans.premium.features.recipes'),
          t('plans.premium.features.ai'),
          t('plans.premium.features.planning'),
          t('plans.premium.features.shopping'),
          t('plans.premium.features.exclusive'),
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
              {t('plans.title')}{" "}
              <span className="bg-gradient-to-r from-[#f54703] to-[#ff7518] bg-clip-text text-transparent">{t('plans.title').split(' ')[1]}</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('plans.subtitle')}
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-lg ${billingCycle === "monthly" ? "text-gray-800 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>{t('plans.monthly')}</span>
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
              <span className={`text-lg ${billingCycle === "yearly" ? "text-gray-800 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>{t('plans.yearly')}</span>
              {billingCycle === "yearly" && (
                <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">{t('plans.save')}</Badge>
              )}
            </div>

            {/* Botão de Teste Stripe */}
            <div className="mt-6">
              <Link href="/stripe-test">
                <Button variant="outline" className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                  🧪 Testar Pagamento Stripe
                </Button>
              </Link>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">{t('common.loading')}</p>
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
                        ⭐ {t('plans.most.popular')}
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
                        {plan.plan_type === 'free' ? t('plans.free.description') : 
                         plan.plan_type === 'basic' ? t('plans.pro.description') :
                         plan.plan_type === 'premium' ? t('plans.premium.description') : t('plans.premium.description')}
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
                        {plan.amount === 0 ? t('plans.start.free') : t('plans.upgrade')}
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