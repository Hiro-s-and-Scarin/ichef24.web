"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Check, Sparkles, Crown, Zap, Users, Clock, Heart } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTranslation } from "react-i18next"

export default function PlansPage() {
  const { t } = useTranslation()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const plans = [
    {
      name: t('plans.free.name'),
      subtitle: t('plans.free'),
      price: { monthly: 0, yearly: 0 },
      description: t('plans.free.description'),
      icon: <ChefHat className="w-8 h-8" />,
      color: "from-gray-500 to-gray-600",
      features: [
        t('plans.free.features.recipes'),
        t('plans.free.features.generation'),
        t('plans.free.features.access'),
        t('plans.free.features.support'),
      ],
      limitations: [t('plans.free.limitations.daily'), t('plans.free.limitations.premium'), t('plans.free.limitations.history')],
      cta: t('plans.start.free'),
      popular: false,
    },
    {
      name: t('plans.pro.name'),
      subtitle: t('plans.most.popular'),
      price: { monthly: 7.9, yearly: 79 },
      description: t('plans.pro.description'),
      icon: <Sparkles className="w-8 h-8" />,
      color: "from-[#f54703] to-[#ff7518]",
      features: [
        t('plans.pro.features.recipes'),
        t('plans.pro.features.generation'),
        t('plans.pro.features.personalized'),
        t('plans.pro.features.history'),
        t('plans.pro.features.filters'),
        t('plans.pro.features.support'),
        t('plans.pro.features.seasonal'),
      ],
      cta: t('plans.pro.cta'),
      popular: true,
    },
    {
      name: t('plans.premium.name'),
      subtitle: t('plans.premium'),
      price: { monthly: 10.9, yearly: 109 },
      description: t('plans.premium.description'),
      icon: <Crown className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      features: [
        t('plans.premium.features.unlimited'),
        t('plans.premium.features.advanced'),
        t('plans.premium.features.weekly'),
        t('plans.premium.features.shopping'),
        t('plans.premium.features.nutrition'),
        t('plans.premium.features.exclusive'),
        t('plans.premium.features.support'),
        t('plans.premium.features.early'),
        t('plans.premium.features.community'),
      ],
      cta: t('plans.premium.cta'),
      popular: false,
    },
  ]

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-[#ff7518]" />,
      title: "IA Avançada",
      description: "Algoritmos de última geração para receitas personalizadas",
    },
    {
      icon: <Heart className="w-6 h-6 text-[#ff7518]" />,
      title: "Favoritos Ilimitados",
      description: "Salve todas as suas receitas preferidas sem limite",
    },
    {
      icon: <Users className="w-6 h-6 text-[#ff7518]" />,
      title: "Comunidade",
      description: "Conecte-se com outros apaixonados por culinária",
    },
    {
      icon: <Clock className="w-6 h-6 text-[#ff7518]" />,
      title: "Suporte 24/7",
      description: "Ajuda sempre que você precisar, a qualquer hora",
    },
  ]

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

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-105 ${
                  plan.popular ? "border-[#ff7518]/50 shadow-2xl shadow-[#ff7518]/20" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#f54703] to-[#ff7518] text-white text-center py-2 text-sm font-medium">
                    ⭐ Mais Popular
                  </div>
                )}

                <CardHeader className={`text-center ${plan.popular ? "pt-12" : "pt-8"}`}>
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl text-gray-800 dark:text-white">{plan.name}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>

                  <div className="py-6">
                    <div className="text-4xl font-bold text-gray-800 dark:text-white">
                      R${" "}
                      {billingCycle === "monthly"
                        ? plan.price.monthly.toFixed(2).replace(".", ",")
                        : (plan.price.yearly / 12).toFixed(2).replace(".", ",")}
                      {plan.price.monthly > 0 && <span className="text-lg text-gray-500 dark:text-gray-400">/mês</span>}
                    </div>
                    {billingCycle === "yearly" && plan.price.yearly > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ou R$ {plan.price.yearly.toFixed(2).replace(".", ",")} por ano
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations && (
                    <div className="border-t border-gray-200 dark:border-gray-700/50 pt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Limitações:</p>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="text-sm text-gray-500 dark:text-gray-400">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    className={`w-full py-6 text-lg font-medium ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#f54703] to-[#ff7518] hover:from-[#ff7518] hover:to-[#f54703] text-white border-0"
                        : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 bg-transparent"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link
                      href={
                        plan.price.monthly === 0
                          ? "/register"
                          : "/register?plan=" + plan.name.toLowerCase().replace(" ", "-")
                      }
                    >
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Por que escolher o iChef24?</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Recursos que fazem a diferença na sua experiência culinária</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#ff7518]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-8">Perguntas Frequentes</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Posso cancelar a qualquer momento?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Sim, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Como funciona o período gratuito?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      O plano gratuito é permanente e inclui funcionalidades básicas para você experimentar.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Posso mudar de plano depois?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Os dados são seguros?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Sim, utilizamos criptografia de ponta e seguimos as melhores práticas de segurança.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Card className="bg-gradient-to-r from-[#f54703]/10 to-[#ff7518]/10 border-[#ff7518]/30 max-w-4xl mx-auto">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Ainda tem dúvidas?</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                  Comece com o plano gratuito e descubra como o iChef24 pode transformar sua experiência na cozinha.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#f54703] to-[#ff7518] hover:from-[#ff7518] hover:to-[#f54703] text-white border-0"
                    asChild
                  >
                    <Link href="/register">Começar Gratuitamente</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 bg-transparent"
                  >
                    Falar com Vendas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
