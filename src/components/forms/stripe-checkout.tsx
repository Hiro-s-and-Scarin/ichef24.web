"use client"

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Lock, Shield, Loader2, CreditCard } from 'lucide-react'
import { useCreatePayment } from '@/network/hooks/stripe'
import { useCurrentUser } from '@/network/hooks/users/useUsers'
import { useCurrencyFormatter } from '@/lib/utils/currency'

interface PlanDetails {
  id: string
  name: string
  price: number
  billing_cycle: "monthly" | "yearly"
  features: string[]
}

interface StripeCheckoutProps {
  planDetails: PlanDetails
  onSuccess: () => void
  onBack: () => void
}

import { CheckoutFormData } from "@/types/forms"
import { checkoutSchema } from "@/schemas/forms"

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      backgroundColor: 'transparent',
    },
    invalid: {
      color: '#9e2146',
    },
  },
}

export function StripeCheckout({ planDetails, onSuccess, onBack }: StripeCheckoutProps) {
  const { t } = useTranslation()
  const stripe = useStripe()
  const elements = useElements()
  const [isSuccess, setIsSuccess] = useState(false)
  
  // Hooks do projeto
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser()
  const createPaymentMutation = useCreatePayment()
  
  // Hook para formatação de moeda baseada no idioma
  const { formatCurrency } = useCurrencyFormatter()
  
  // React Hook Form
  const { handleSubmit, formState: { isValid } } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    mode: 'onChange'
  })

  const onSubmit = async () => {
    if (!stripe || !elements) {
      return
    }

    if (!currentUser?.email) {
      return
    }

    try {
      // Criar PaymentMethod
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: currentUser.name || t('checkout.client.name'),
          email: currentUser.email,
        },
      })

      if (error) {
        return
      }

      if (!paymentMethod) {
        return
      }

      // Enviar para o backend usando o hook
      // planDetails.id contém o stripe_subscription_id do backend
      const result = await createPaymentMutation.mutateAsync({
        productId: planDetails.id, // Este é o stripe_subscription_id do backend
        paymentMethodType: 'card',
        paymentMethod: paymentMethod.id,
        email: currentUser.email,
      })

      if (result.status === 'succeeded') {
        setIsSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else if (result.status === 'requires_action' || result.status === 'requires_payment_method') {
        // Confirmar pagamento se necessário
        if (result.client_secret) {
          const { error: confirmError } = await stripe.confirmCardPayment(result.client_secret)
          
          if (confirmError) {
            toast.error('Erro na confirmação: ' + confirmError.message)
          } else {
            setIsSuccess(true)
            setTimeout(() => {
              onSuccess()
            }, 2000)
          }
        }
      } else if (result.status === 'processing') {
        setIsSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (error) {
      toast.error('Erro no pagamento')
    }
  }

  if (isLoadingUser) {
    return (
      <div className="text-center space-y-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-300">Carregando dados do usuário...</p>
      </div>
    )
  }

  if (!currentUser?.email) {
    return (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-12 h-12 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Usuário não autenticado
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Faça login para continuar com o pagamento.
        </p>
        <Button variant="outline" onClick={onBack}>
          Voltar aos Planos
        </Button>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Pagamento Confirmado!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Seu plano <strong>{planDetails.name}</strong> foi ativado com sucesso.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumo do Plano */}
      <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 dark:text-white">
            {t('checkout.plan.summary')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">{t('checkout.plan.name')}:</span>
            <span className="font-semibold text-gray-800 dark:text-white">{planDetails.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">{t('checkout.plan.cycle')}:</span>
            <Badge variant="outline">
              {planDetails.billing_cycle === "monthly" ? t('plans.monthly') : t('plans.yearly')}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">{t('checkout.plan.value')}:</span>
            <span className="text-2xl font-bold text-orange-600">
              {formatCurrency(planDetails.price)}
            </span>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">{t('checkout.plan.features')}:</h4>
            <ul className="space-y-2">
              {planDetails.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Pagamento */}
      <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {t('checkout.payment.card')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('checkout.payment.card.data')}
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700">
                <CardElement options={cardElementOptions} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('checkout.payment.security.ssl')}
              </p>
            </div>

            <Button
              type="submit"
              disabled={!stripe || createPaymentMutation.isPending}
              className="w-full bg-orange-500 hover:bg-orange-600 py-6 text-lg"
            >
              {createPaymentMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('checkout.payment.processing')}
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  {t('checkout.payment.finish')}
                </>
              )}
            </Button>
          </form>

          {/* Segurança */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Shield className="w-4 h-4" />
            <span>{t('checkout.payment.security.ssl')}</span>
          </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão Voltar */}
      <div className="text-center">
        <Button variant="outline" onClick={onBack}>
          {t('common.back')} aos {t('header.plans')}
        </Button>
      </div>
    </div>
  )
} 