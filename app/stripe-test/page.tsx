"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CreditCard, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

// Chave pública do Stripe hardcoded
const STRIPE_PUBLISHABLE_KEY = "pk_test_51RZcXaCD3Jr5oY2ganomuVgKLHiRjQn9SrwtK5Tvs1gsZGAMh5ykfEkYU98ecYeZ9AcA9aZeutDlBVA8ymo8IrXp00XeUzphvR"

// ID do produto para teste
const productId = "prod_SsYAU6WUTHFzlx"

// Componente do formulário de checkout
function CheckoutForm() {
  const { t, ready } = useTranslation()
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentResult, setPaymentResult] = useState<{
    status: string;
    paymentMethod: string;
    backendResponse: unknown;
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      toast.error('Stripe não está carregado')
      return
    }

    setIsLoading(true)

    try {
      // Criar PaymentMethod
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      })

      if (error) {
        toast.error('Erro ao criar método de pagamento: ' + error.message)
        return
      }

      if (!paymentMethod) {
        toast.error('PaymentMethod não foi criado')
        return
      }

      // Enviar para o backend
      const response = await fetch('/api/stripe/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          paymentMethodType: 'card',
          paymentMethod: paymentMethod.id,
          email: 'teste@exemplo.com',
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setPaymentResult({
          status: 'success',
          paymentMethod: paymentMethod.id,
          backendResponse: result
        })
        toast.success('Pagamento processado com sucesso!')

      } else {
        const errorData = await response.json()
        toast.error('Erro no backend: ' + (errorData.message || 'Erro desconhecido'))
      }
    } catch (error) {
      toast.error('Erro ao processar pagamento: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!ready) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("stripe.test.card.data")}
        </label>
        <div className="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {t("stripe.test.processing")}
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            {t("stripe.test.pay.with.card")}
          </>
        )}
      </Button>

      {/* Resultado do Pagamento */}
      {paymentResult && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50">
          <CardHeader>
            <CardTitle className="text-lg text-green-800 dark:text-green-200 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {t("stripe.test.payment.processed")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-green-700 dark:text-green-300">
            <p><strong>Payment Method ID:</strong> {paymentResult.paymentMethod}</p>
            <p><strong>Status:</strong> {paymentResult.status}</p>
          </CardContent>
        </Card>
      )}
    </form>
  )
}

export default function StripeTestPage() {
  const { t, ready } = useTranslation()

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/plans">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("stripe.test.back.to.plans")}
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {t("stripe.test.title")}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t("stripe.test.subtitle")}
            </p>
          </div>
        </div>

        {/* Informações do Produto */}
        <Card className="max-w-md mx-auto mb-8 bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center">{t("stripe.test.product.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">{t("stripe.test.product.id")}</span>
              <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{productId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">{t("stripe.test.product.type")}</span>
              <span className="font-semibold text-gray-800 dark:text-white">{t("stripe.test.product.payment.type")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Stripe Elements */}
        <div className="max-w-2xl mx-auto">
          <Elements stripe={loadStripe(STRIPE_PUBLISHABLE_KEY)}>
            <CheckoutForm />
          </Elements>
        </div>

        {/* Informações de Teste */}
        <div className="max-w-2xl mx-auto mt-8">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/50">
            <CardHeader>
                          <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
              {t("stripe.test.test.cards")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <p><strong>{t("stripe.test.success")}</strong> 4242 4242 4242 4242</p>
            <p><strong>{t("stripe.test.failure")}</strong> 4000 0000 0000 0002</p>
            <p><strong>{t("stripe.test.3d.secure")}</strong> 4000 0025 0000 3155</p>
            <p><strong>{t("stripe.test.cvv")}</strong> {t("stripe.test.cvv.description")}</p>
            <p><strong>{t("stripe.test.date")}</strong> {t("stripe.test.date.description")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Instruções */}
        <div className="max-w-2xl mx-auto mt-6">
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50">
            <CardHeader>
                          <CardTitle className="text-lg text-green-800 dark:text-green-200">
              {t("stripe.test.how.it.works")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-green-700 dark:text-green-300">
            <p>{t("stripe.test.step1")}</p>
            <p>{t("stripe.test.step2")}</p>
            <p>{t("stripe.test.step3")}</p>
            <p>{t("stripe.test.step4")} <code>/api/stripe/payment</code></p>
            <p>{t("stripe.test.step5")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 