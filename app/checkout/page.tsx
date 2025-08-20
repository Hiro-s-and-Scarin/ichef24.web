"use client"

import { useState, Suspense } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, QrCode, Lock, Shield, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { CardFormData, PlanDetails } from "@/types/forms"
import { cardSchema } from "@/schemas/forms"

function CheckoutContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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

  const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm<CardFormData>({
    resolver: yupResolver(cardSchema), mode: "onChange"
  })

  const onCardSubmit = async (data: CardFormData) => {
    setIsProcessing(true)
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aqui você integraria com a API do Stripe

      
      setIsSuccess(true)
      toast.success("Pagamento processado com sucesso!")
    } catch (error) {
      toast.error("Erro ao processar pagamento. Tente novamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  const onPixSubmit = async () => {
    setIsProcessing(true)
    try {
      // Simular geração de PIX
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Aqui você geraria o QR Code do PIX

      
      setIsSuccess(true)
      toast.success("PIX gerado com sucesso!")
    } catch (error) {
      toast.error("Erro ao gerar PIX. Tente novamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Pagamento Confirmado!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Seu plano <strong>{planDetails.name}</strong> foi ativado com sucesso. 
              Você já pode aproveitar todos os recursos premium!
            </p>
            <div className="space-y-4">
              <Link href="/plans">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Ver Meus Planos
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">
                  {t('common.back')} ao Início
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resumo do Plano */}
            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800 dark:text-white">
                  Resumo do Plano
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Plano:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{planDetails.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Ciclo:</span>
                  <Badge variant="outline">
                    {planDetails.billing_cycle === "monthly" ? t('plans.monthly') : t('plans.yearly')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Valor:</span>
                  <span className="text-2xl font-bold text-orange-600">
                    R$ {planDetails.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Recursos Inclusos:</h4>
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
                <CardTitle className="text-2xl text-gray-800 dark:text-white">
                  Método de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "card" | "pix")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Cartão
                    </TabsTrigger>
                    <TabsTrigger value="pix" className="flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      PIX
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4 mt-6">
                    <form onSubmit={handleSubmit(onCardSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Número do Cartão
                        </label>
                        <Input
                          {...register("cardNumber")}
                          placeholder="1234 5678 9012 3456"
                          className="border-gray-300 dark:border-gray-600"
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nome do Titular
                        </label>
                        <Input
                          {...register("cardHolder")}
                          placeholder="Nome como está no cartão"
                          className="border-gray-300 dark:border-gray-600"
                        />
                        {errors.cardHolder && (
                          <p className="text-red-500 text-sm">{errors.cardHolder.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mês
                          </label>
                          <Input
                            {...register("expiryMonth")}
                            placeholder="MM"
                            className="border-gray-300 dark:border-gray-600"
                          />
                          {errors.expiryMonth && (
                            <p className="text-red-500 text-sm">{errors.expiryMonth.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Ano
                          </label>
                          <Input
                            {...register("expiryYear")}
                            placeholder="AAAA"
                            className="border-gray-300 dark:border-gray-600"
                          />
                          {errors.expiryYear && (
                            <p className="text-red-500 text-sm">{errors.expiryYear.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            CVV
                          </label>
                          <Input
                            {...register("cvv")}
                            placeholder="123"
                            className="border-gray-300 dark:border-gray-600"
                          />
                          {errors.cvv && (
                            <p className="text-red-500 text-sm">{errors.cvv.message}</p>
                          )}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={!isValid || isProcessing}
                        className="w-full bg-orange-500 hover:bg-orange-600 py-6 text-lg"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5 mr-2" />
                            Finalizar Pagamento
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="pix" className="space-y-4 mt-6">
                    <div className="text-center space-y-4">
                      <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto">
                        <QrCode className="w-16 h-16 text-gray-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        Clique no botão abaixo para gerar o QR Code do PIX
                      </p>
                      <Button
                        onClick={onPixSubmit}
                        disabled={isProcessing}
                        className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Gerando PIX...
                          </>
                        ) : (
                          <>
                            <QrCode className="w-5 h-5 mr-2" />
                            Gerar PIX
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Segurança */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>Pagamento seguro com criptografia SSL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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