"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Check, Sparkles, Crown, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { useGetStripeProducts } from "@/network/hooks/stripe";
import { useCreateFreePlan } from "@/network/hooks/plans";
import { useCurrencyFormatter } from "@/lib/utils/currency";
import { Plan } from "@/src/types";
import { convertStripeProductsToPlans } from "@/lib/utils/stripe-to-plans";
import { toast } from "sonner";

export function PlansPageContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { data: stripeProductsData, isLoading: isLoadingProducts, error } = useGetStripeProducts();
  const createFreePlanMutation = useCreateFreePlan();

  const { formatCurrency } = useCurrencyFormatter();

  const plans: Plan[] = useMemo(() => {
    if (!stripeProductsData?.success || !stripeProductsData.data) {
      return [];
    }
    return convertStripeProductsToPlans(stripeProductsData.data);
  }, [stripeProductsData]);

  const getPlanIcon = useCallback((planType: string) => {
    switch (planType.toLowerCase()) {
      case "free":
      case "trial":
      case "aprendiz":
        return <ChefHat className="w-8 h-8" />;
      case "basic":
      case "chef":
        return <Sparkles className="w-8 h-8" />;
      case "premium":
      case "master":
        return <Crown className="w-8 h-8" />;
      case "enterprise":
        return <Zap className="w-8 h-8" />;
      default:
        return <ChefHat className="w-8 h-8" />;
    }
  }, []);

  // Função para obter cor baseada no tipo de plano
  const getPlanColor = useCallback((planType: string) => {
    switch (planType.toLowerCase()) {
      case "free":
      case "trial":
      case "aprendiz":
        return "from-gray-500 to-gray-600";
      case "basic":
      case "chef":
        return "from-[#f54703] to-[#ff7518]";
      case "premium":
      case "master":
        return "from-purple-500 to-purple-600";
      case "enterprise":
        return "from-blue-500 to-blue-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  }, []);

  // Função para obter features baseadas no tipo de plano
  const getPlanFeatures = useCallback((planType: string) => {
    switch (planType.toLowerCase()) {
      case "free":
      case "trial":
      case "aprendiz":
        return [
          t("plans.free.features.recipes"),
          t("plans.free.features.generation"),
          t("plans.free.features.access"),
          "2 receitas salvas no histórico",
          t("plans.free.features.support"),
        ];
      case "basic":
      case "chef":
        return [
          t("plans.pro.features.recipes"),
          t("plans.pro.features.generation"),
          t("plans.pro.features.personalized"),
          "10 receitas salvas no histórico",
          t("plans.pro.features.filters"),
          t("plans.pro.features.support"),
        ];
      case "premium":
      case "master":
        return [
          t("plans.premium.features.recipes"),
          t("plans.premium.features.ai"),
          t("plans.premium.features.planning"),
          t("plans.premium.features.shopping"),
          t("plans.premium.features.exclusive"),
          t("plans.premium.features.support"),
        ];
      case "enterprise":
        return [
          t("plans.premium.features.recipes"),
          t("plans.premium.features.ai"),
          t("plans.premium.features.planning"),
          t("plans.premium.features.shopping"),
          t("plans.premium.features.exclusive"),
        ];
      default:
        return [];
    }
  }, [t]);

  const handleSubscribe = useCallback(async (plan: Plan) => {
   
    
    if (plan.amount === 0) {
      try {
        setIsLoading(true);
        
        await createFreePlanMutation.mutateAsync({
          plan_type: plan.plan_type,
          billing_cycle: 'monthly',
          amount: 0,
          currency: 'BRL',
          stripe_subscription_id: plan.stripe_subscription_id,
        });

        toast.success("Plano gratuito ativado com sucesso! Bem-vindo ao iChef!");
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Erro ao criar plano gratuito:', error);
        const errorMessage = error?.response?.data?.message || "Erro ao ativar plano gratuito";
        
        if (errorMessage.includes('já está vinculado')) {
          toast.info("Você já possui um plano ativo!");
          router.push('/dashboard');
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // Encontrar o preço correto baseado no ciclo de cobrança selecionado
    let priceId = plan.stripe_subscription_id; // Fallback para o ID do produto
    
    // Se temos informações de preço específicas, usar o preço correto
    if (plan.price && stripeProductsData?.data) {
      // Buscar o produto correspondente no Stripe
      const stripeProduct = stripeProductsData.data.find(
        product => product.id === plan.stripe_subscription_id
      );
      
      console.log('Produto encontrado no Stripe:', stripeProduct);
      
      if (stripeProduct) {
        // Buscar o preço mensal do Stripe
        const monthlyPrice = stripeProduct.prices.find(price => 
          price.recurring?.interval === "month" && price.active
        );
        if (monthlyPrice) {
          priceId = monthlyPrice.id;
          console.log('Preço mensal encontrado:', monthlyPrice);
        }
      }
    }

    console.log('ID do preço final:', priceId);
    console.log('Ciclo de cobrança:', "monthly"); // Simplificado para "monthly"

    // Redirecionar para checkout com o ID do preço correto
    router.push(
      `/checkout?planId=${priceId}&planName=${plan.name}&price=${plan.price?.monthly || plan.amount}&billingCycle=monthly`,
    );
  }, [stripeProductsData, router, createFreePlanMutation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
              {t("plans.title")}{" "}
              <span className="bg-gradient-to-r from-[#f54703] to-[#ff7518] bg-clip-text text-transparent">
                {t("plans.title").split(" ")[1]}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("plans.subtitle")}
            </p>

            {/* Mensagem Informativa sobre Substituição de Planos */}
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-medium">ℹ️ Informação:</span> Ao assinar um novo plano, o atual será substituído automaticamente. Tome cuidado ao escolher, pois não é possível manter múltiplos planos ativos simultaneamente.
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingProducts ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">{t("common.loading")}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Plans Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {plans.map((plan: Plan) => (
                  <Card
                    key={plan.stripe_subscription_id}
                    className={`relative bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-105 flex flex-col ${
                      plan.plan_type === "basic"
                        ? "border-[#ff7518]/50 shadow-2xl shadow-[#ff7518]/20"
                        : ""
                    }`}
                  >
                    {plan.plan_type === "basic" && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#f54703] to-[#ff7518] text-white text-center py-2 text-sm font-medium">
                        ⭐ {t("plans.most.popular")}
                      </div>
                    )}

                    <CardHeader
                      className={`text-center ${plan.plan_type === "basic" ? "pt-12" : "pt-8"}`}
                    >
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${getPlanColor(plan.plan_type)} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                      >
                        {getPlanIcon(plan.plan_type)}
                      </div>
                      <CardTitle className="text-2xl text-gray-800 dark:text-white">
                        {plan.name}
                      </CardTitle>
                      <p className="text-gray-600 dark:text-gray-300">
                        {plan.plan_type === "free"
                          ? t("plans.free.description")
                          : plan.plan_type === "basic"
                            ? t("plans.pro.description")
                            : plan.plan_type === "premium"
                              ? t("plans.premium.description")
                              : t("plans.premium.description")}
                      </p>

                      <div className="py-6">
                        <div className="text-4xl font-bold text-gray-800 dark:text-white">
                          {formatCurrency(plan.price?.monthly || plan.amount)}
                          {plan.amount > 0 && (
                            <span className="text-lg text-gray-500 dark:text-gray-400">
                              /mês
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6 flex-1 flex flex-col">
                      <ul className="space-y-3 flex-1">
                        {getPlanFeatures(plan.plan_type).map(
                          (feature: string, featureIndex: number) => (
                            <li
                              key={featureIndex}
                              className="flex items-start gap-3"
                            >
                              <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {feature}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>

                      <div className="mt-auto pt-4">
                                              <Button
                        className={`w-full py-6 text-lg font-medium ${
                          plan.plan_type === "basic"
                            ? "bg-gradient-to-r from-[#f54703] to-[#ff7518] hover:from-[#ff7518] hover:to-[#f54703] text-white border-0"
                            : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 bg-transparent"
                        }`}
                        variant={
                          plan.plan_type === "basic" ? "default" : "outline"
                        }
                        onClick={() => handleSubscribe(plan)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          "Processando..."
                        ) : (
                          plan.amount === 0
                            ? t("plans.start.free")
                            : t("plans.upgrade")
                        )}
                      </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
