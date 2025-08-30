"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft, Loader2, CreditCard } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { PlanDetails } from "@/types/forms"
import { useCreateStripeCheckout } from "@/network/hooks/stripe"
import { useCurrencyFormatter } from "@/lib/utils/currency"
import { PaymentStatus } from "@/src/components/ui/payment-status"
import { useAuth } from "@/src/contexts/auth-context"

function CheckoutContent() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { formatCurrencyWithName } = useCurrencyFormatter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | 'processing'>('pending')

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

  const createCheckoutMutation = useCreateStripeCheckout()

  const handleCreateCheckout = async () => {
    // Verificar se o usuário está logado
    if (!user?.email) {
      toast.error("Você precisa estar logado para continuar")
      return
    }

    setIsLoading(true)
    setPaymentStatus('processing')
    
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      
      const result = await createCheckoutMutation.mutateAsync({
        priceId: planDetails.id,  
        email: user?.email || '', 
        successUrl: `${baseUrl}/checkout/success?planName=${encodeURIComponent(planDetails.name)}`,
        cancelUrl: `${baseUrl}/plans`,
      })

      if (result.data?.url) {
        console.log('Redirecionando para checkout do Stripe:', result.data.url)
        setPaymentStatus('pending')
        toast.success("Redirecionando para o Stripe...")
        
        setTimeout(() => {
          window.location.href = result.data.url
        }, 1500)
      } else {
        setPaymentStatus('failed')
        toast.error("Erro: URL de checkout não recebida")
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error)
      setPaymentStatus('failed')
      toast.error("Erro ao criar checkout. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/plans" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4">
              <ArrowLeft className="w-4 h-4" />
              {t('common.back')} aos Planos
            </Link>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Finalizar Assinatura
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Complete sua assinatura do plano {planDetails.name}
            </p>
          </div>

          {/* Status do Pagamento */}
          {paymentStatus !== 'pending' && (
            <PaymentStatus
              status={paymentStatus}
              message={
                paymentStatus === 'processing' 
                  ? 'Preparando checkout do Stripe...'
                  : paymentStatus === 'success'
                  ? 'Checkout criado com sucesso!'
                  : 'Erro ao criar checkout'
              }
              planName={planDetails.name}
              amount={planDetails.price}
            />
          )}

          {/* Resumo do Plano */}
          <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {planDetails.name}
              </h2>
              <div className="text-4xl font-bold text-orange-600">
                {formatCurrencyWithName(planDetails.price)}
                <span className="text-lg text-gray-500 dark:text-gray-400">
                  /{planDetails.billing_cycle === "monthly" ? "mês" : "ano"}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Recursos Inclusos:</h4>
                <ul className="space-y-2 text-left">
                  {planDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Botão de Checkout */}
          <div className="text-center">
            <Button
              onClick={handleCreateCheckout}
              disabled={isLoading || paymentStatus === 'processing'}
              className="w-full bg-orange-500 hover:bg-orange-600 py-6 text-lg text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Preparando Checkout...
                </>
              ) : paymentStatus === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Redirecionando...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  🔒 Finalizar Assinatura com Stripe
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Você será redirecionado para o checkout seguro do Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Checkout() {
  const { t } = useTranslation()
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{t('common.loading')} checkout...</p>
          </div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
} 