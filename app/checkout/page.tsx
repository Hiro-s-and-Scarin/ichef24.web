"use client"

import { Suspense } from "react"
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise, getStripeConfigForLanguage } from '@/lib/api/stripe'
import { StripeCheckout } from '@/components/forms/stripe-checkout'
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"

interface PlanDetails {
  id: string
  name: string
  price: number
  billing_cycle: "monthly" | "yearly"
  features: string[]
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { i18n } = useTranslation()

  const planDetails: PlanDetails = {
    id: searchParams.get("planId") || "plan-1",
    name: searchParams.get("planName") || "Plano Pro",
    price: parseFloat(searchParams.get("price") || "29.90"),
    billing_cycle: (searchParams.get("billingCycle") as "monthly" | "yearly") || "monthly",
    features: [
      "Receitas ilimitadas com IA",
      "Acesso premium à comunidade",
      "Chat personalizado com chef IA",
      "Receitas exclusivas",
      "Suporte prioritário"
    ]
  }

  const handleSuccess = () => {
    // Redirecionar para página de sucesso ou dashboard
    router.push('/plans?success=true')
  }

  const handleBack = () => {
    router.push('/plans')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/plans" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Voltar aos Planos
            </Link>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Finalizar Assinatura
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Complete sua assinatura do plano {planDetails.name}
            </p>
          </div>

                                {/* Stripe Elements */}
                      <Elements stripe={stripePromise} options={getStripeConfigForLanguage(i18n.language)}>
                        <StripeCheckout
                          planDetails={planDetails}
                          onSuccess={handleSuccess}
                          onBack={handleBack}
                        />
                      </Elements>
        </div>
      </div>
    </div>
  )
}

export default function Checkout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando checkout...</p>
          </div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
} 