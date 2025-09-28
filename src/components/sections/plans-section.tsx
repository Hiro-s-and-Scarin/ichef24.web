"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Check, Sparkles, Crown, Zap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

import { useGetStripeProducts } from "@/network/hooks/stripe";
import { useCreateFreePlan, useGetFreePlanStatus } from "@/network/hooks/plans";
import { useCurrencyFormatter } from "@/lib/utils/currency";
import { Plan } from "@/src/types";
import { convertStripeProductsToPlans } from "@/lib/utils/stripe-to-plans";
import { toast } from "sonner";

export function PlansSection() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const { formatCurrency, getCurrentCurrency } = useCurrencyFormatter();
  const currentCurrency = getCurrentCurrency();
  
  // Usar a moeda detectada pelo sistema (geo-localização tem prioridade)
  const finalCurrency = currentCurrency;

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const { data: stripeProductsData, isLoading: isLoadingProducts } =
    useGetStripeProducts(finalCurrency, billingCycle);
  
  const createFreePlanMutation = useCreateFreePlan();
  const { data: freePlanStatus } = useGetFreePlanStatus();

  // Recarregar produtos quando moeda ou ciclo de cobrança mudar
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["stripe", "products"],
      exact: false,
    });
  }, [finalCurrency, billingCycle, queryClient]);

  // Invalidar queries quando a linguagem mudar
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["stripe", "products"],
      exact: false,
    });
  }, [i18n.language, queryClient]);

  const plans: Plan[] = useMemo(() => {
    // Plano gratuito sempre disponível
    const freePlan: Plan = {
      id: 0,
      plan_type: "free",
      billing_cycle: "monthly",
      amount: 0,
      currency: finalCurrency,
      status: "active",
      cancel_at_period_end: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: "Plano Gratuito",
      stripe_subscription_id: "free_plan",
      metadata: {},
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: [
        "Gerar Receitas: 2 por dia",
        "Salvar em Favoritas: até 5",
        "Histórico: não disponível",
        "Suporte por email",
      ],
      isPopular: false,
    };

    // Planos da Stripe
    if (!stripeProductsData?.success || !stripeProductsData.data) {
      return [freePlan];
    }
    
    const stripePlans = convertStripeProductsToPlans(stripeProductsData.data);
    return [freePlan, ...stripePlans];
  }, [stripeProductsData, finalCurrency, billingCycle, t]);

  const getPlanPrice = useCallback((plan: Plan) => {
    // Se o plano tem preços específicos para mensal/anual, usar baseado no ciclo
    if (plan.price && typeof plan.price === 'object') {
      if (billingCycle === 'yearly' && plan.price.yearly !== undefined) {
        return plan.price.yearly;
      }
      if (billingCycle === 'monthly' && plan.price.monthly !== undefined) {
        return plan.price.monthly;
      }
    }
    
    // Fallback para o preço padrão se não houver preço específico para o ciclo
    return plan.amount;
  }, [billingCycle]);

  const getPlanColor = useCallback((planType: string) => {
    switch (planType.toLowerCase()) {
      case "free":
      case "trial":
      case "aprendiz":
        return "from-gray-400 to-gray-500";
      case "basic":
      case "chef":
        return "from-[#f54703] to-[#ff7518]";
      case "premium":
      case "master":
        return "from-purple-500 to-purple-600";
      case "enterprise":
        return "from-yellow-500 to-yellow-600";
      default:
        return "from-gray-400 to-gray-500";
    }
  }, []);

  const getPlanIcon = useCallback((planType: string) => {
    switch (planType.toLowerCase()) {
      case "free":
      case "trial":
      case "aprendiz":
        return <ChefHat className="w-8 h-8 text-white" />;
      case "basic":
      case "chef":
        return <Sparkles className="w-8 h-8 text-white" />;
      case "premium":
      case "master":
        return <Crown className="w-8 h-8 text-white" />;
      case "enterprise":
        return <Crown className="w-8 h-8 text-white" />;
      default:
        return <ChefHat className="w-8 h-8 text-white" />;
    }
  }, []);

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

  const getCurrentPlanType = useCallback(
    (plan: Plan) => {
      const currentPrice = getPlanPrice(plan);

      if (currentPrice === 0) return "free";
      if (currentPrice <= 3) return "basic"; // Plano médio: $3
      if (currentPrice <= 5) return "premium"; // Plano avançado: $5
      return "enterprise"; // Planos acima de $5
    },
    [getPlanPrice]
  );

  // Função para obter o texto do ciclo de cobrança
  const getBillingCycleText = useCallback(
    (plan: Plan) => {
      if (plan.amount === 0) return "";

      if (billingCycle === "yearly") {
        return t("plans.billing.perYear");
      }

      return t("plans.billing.perMonth");
    },
    [billingCycle, t]
  );

  const handleSubscribe = useCallback(
    async (plan: Plan) => {
      // Verificar se o usuário está logado
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      if (!cookies.jwt) {
        toast.info("Faça login para continuar com a assinatura!");
        router.push('/login');
        return;
      }

      if (plan.amount === 0) {
        try {
          setIsLoading(true);

          await createFreePlanMutation.mutateAsync({
            plan_type: plan.plan_type,
            billing_cycle: "monthly",
            amount: 0,
            currency: finalCurrency,
            stripe_subscription_id: plan.stripe_subscription_id,
          });

          toast.success(
            "Plano gratuito ativado com sucesso! Bem-vindo ao iChef!"
          );

          router.push('/');
        } catch (error: unknown) {
          console.error('Erro ao criar plano gratuito:', error);
          const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Erro ao ativar plano gratuito";
          
          if (errorMessage.includes('já está vinculado')) {
            toast.info("Você já possui um plano ativo!");
            router.push('/home');
          } else {
            toast.error(errorMessage);
          }
        } finally {
          setIsLoading(false);
        }
        return;
      }
      
      // Debug logs
      console.log('Plan:', plan);
      console.log('Stripe Products Data:', stripeProductsData);
      console.log('Billing Cycle:', billingCycle);
      
      // Encontrar o preço correto baseado no ciclo de cobrança selecionado
      let priceId = plan.stripe_subscription_id; // Fallback para o ID do produto
      
      // Se temos informações de preço específicas, usar o preço correto
      if (plan.price && stripeProductsData?.data) {
        // Buscar o produto correspondente no Stripe
        const stripeProduct = stripeProductsData.data.find(
          product => product.id === plan.stripe_subscription_id
        );
        
        console.log('Found Stripe Product:', stripeProduct);
        
        if (stripeProduct) {
          // Buscar o preço baseado no ciclo de cobrança selecionado
          const targetPrice = stripeProduct.prices.find(price => 
            price.recurring?.interval === (billingCycle === 'monthly' ? 'month' : 'year') && price.active
          );
          
          console.log('Target Price:', targetPrice);
          console.log('All Prices:', stripeProduct.prices);
          
          if (targetPrice) {
            priceId = targetPrice.id;
            console.log('Using Price ID:', priceId);
          }
        }
      }

      console.log('Final Price ID:', priceId);

      // Redirecionar para checkout com o ID do preço correto
      router.push(
        `/checkout?planId=${priceId}&planName=${plan.name}&price=${getPlanPrice(plan)}&billingCycle=${billingCycle}`,
      );
    },
    [stripeProductsData, router, createFreePlanMutation, billingCycle, finalCurrency, getPlanPrice]
  );

  // Limitar a 3 planos para a seção da home
  const displayPlans = plans.slice(0, 3);

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center space-y-8 mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
              {t("plans.title")}{" "}
              <span className="bg-gradient-to-r from-[#f54703] to-[#ff7518] bg-clip-text text-transparent">
                {t("plans.title").split(" ")[1]}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("plans.subtitle")}
            </p>

            {/* Billing Cycle Toggle Switch */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <div className="flex items-center space-x-3">
                <span
                  className={`text-sm font-medium transition-colors ${
                    billingCycle === "monthly"
                      ? "text-[#f54703]"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {t("plans.billing.monthly")}
                </span>

                {/* Toggle Switch */}
                <button
                  onClick={() =>
                    setBillingCycle(
                      billingCycle === "monthly" ? "yearly" : "monthly"
                    )
                  }
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#f54703] focus:ring-offset-2 ${
                    billingCycle === "yearly"
                      ? "bg-gradient-to-r from-[#f54703] to-[#ff7518]"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
                      billingCycle === "yearly"
                        ? "translate-x-8"
                        : "translate-x-1"
                    }`}
                  />
                </button>

                <span
                  className={`text-sm font-medium transition-colors ${
                    billingCycle === "yearly"
                      ? "text-[#f54703]"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {t("plans.billing.yearly")}
                </span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingProducts ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">{t("common.loading")}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Plans Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-12 mt-8">
                {displayPlans.map((plan: Plan) => (
                  <Card
                    key={plan.stripe_subscription_id}
                    className={`relative bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-105 flex flex-col ${
                      getCurrentPlanType(plan) === "basic"
                        ? "border-[#ff7518]/50 shadow-2xl shadow-[#ff7518]/20"
                        : ""
                    }`}
                  >
                    {getCurrentPlanType(plan) === "basic" && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#f54703] to-[#ff7518] text-white text-center py-2 text-sm font-medium">
                        ⭐ {t("plans.most.popular")}
                      </div>
                    )}

                    <CardHeader
                      className={`text-center ${
                        getCurrentPlanType(plan) === "basic" ? "pt-12" : "pt-6"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${getPlanColor(
                          getCurrentPlanType(plan)
                        )} rounded-xl flex items-center justify-center mx-auto mb-3`}
                      >
                        {getPlanIcon(getCurrentPlanType(plan))}
                      </div>
                      <CardTitle className="text-xl text-gray-800 dark:text-white">
                        {plan.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {getCurrentPlanType(plan) === "free"
                          ? t("plans.free.description")
                          : getCurrentPlanType(plan) === "basic"
                          ? t("plans.pro.description")
                          : getCurrentPlanType(plan) === "premium"
                          ? t("plans.premium.description")
                          : t("plans.premium.description")}
                      </p>

                      <div className="py-4">
                        <div className="text-3xl font-bold text-gray-800 dark:text-white">
                          {formatCurrency(getPlanPrice(plan), finalCurrency)}
                          {plan.amount > 0 && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {getBillingCycleText(plan)}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1 flex flex-col">
                      <ul className="space-y-2 flex-1">
                        {getPlanFeatures(getCurrentPlanType(plan))
                          .slice(0, 4)
                          .map((feature: string, featureIndex: number) => (
                            <li
                              key={featureIndex}
                              className="flex items-start gap-2"
                            >
                              <Check className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {feature}
                              </span>
                            </li>
                          ))}
                      </ul>

                      <div className="mt-auto pt-4">
                        <Button
                          className={`w-full py-3 text-sm font-medium ${
                            getCurrentPlanType(plan) === "basic"
                              ? "bg-gradient-to-r from-[#f54703] to-[#ff7518] hover:from-[#ff7518] hover:to-[#ff7518] text-white border-0"
                              : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 bg-transparent"
                          }`}
                          variant={
                            getCurrentPlanType(plan) === "basic"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleSubscribe(plan)}
                          disabled={
                            isLoading ||
                            (getCurrentPlanType(plan) === "free" &&
                              freePlanStatus?.data?.hasUsedFreePlan)
                          }
                        >
                          {isLoading
                            ? "Processando..."
                            : getCurrentPlanType(plan) === "free" &&
                              freePlanStatus?.data?.hasUsedFreePlan
                            ? "Plano Gratuito Já Utilizado"
                            : plan.amount === 0
                            ? t("plans.start.free")
                            : t("plans.upgrade")}
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
    </section>
  );
}
