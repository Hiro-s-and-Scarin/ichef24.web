import { Plan, StripeProduct } from "@/src/types";

export function convertStripeProductsToPlans(stripeProducts: StripeProduct[]): Plan[] {
  return stripeProducts.map((product, index) => {
    // Encontrar o preço mensal (recurring com interval = month)
    const monthlyPrice = product.prices.find(
      (price) => price.recurring?.interval === "month" && price.active
    );
    
    // Encontrar o preço anual (recurring com interval = year)
    const yearlyPrice = product.prices.find(
      (price) => price.recurring?.interval === "year" && price.active
    );
    
    // Encontrar o preço único (type = one_time)
    const oneTimePrice = product.prices.find(
      (price) => price.type === "one_time" && price.active
    );

    // Determinar o tipo de plano baseado no nome e metadados
    let planType = determinePlanType(
      product.name, 
      product.metadata
    );
    

    
    // Usar o preço mensal como padrão, ou o preço único se não houver mensal
    const defaultPrice = monthlyPrice || yearlyPrice || oneTimePrice;
    
    const plan = {
      id: index + 1, // Usar índice + 1 para garantir IDs únicos
      plan_type: planType,
      billing_cycle: monthlyPrice ? "monthly" : yearlyPrice ? "yearly" : "one_time",
      amount: defaultPrice ? defaultPrice.unit_amount / 100 : 0, // Converter de centavos para reais
      currency: defaultPrice?.currency || "BRL",
      status: "active",
      cancel_at_period_end: false,
      createdAt: new Date(product.created * 1000).toISOString(),
      updatedAt: new Date(product.updated * 1000).toISOString(),
      name: product.name,
      stripe_subscription_id: product.id,
      metadata: product.metadata,
      // Adicionar informações de preço para diferentes ciclos
      price: {
        monthly: monthlyPrice ? monthlyPrice.unit_amount / 100 : 0,
        yearly: yearlyPrice ? yearlyPrice.unit_amount / 100 : 0,
      },
      // Adicionar features baseadas no tipo de plano
      features: getPlanFeatures(planType),
      // Marcar como popular se for o plano chef (intermediário)
      isPopular: planType === "basic",
    } as Plan;
    
    return plan;
  });
}

function determinePlanType(name: string, metadata: Record<string, unknown>): "free" | "basic" | "premium" | "enterprise" {
  const nameLower = name.toLowerCase();
  
  // Priorizar metadados se existirem
  if (metadata?.plan_type && typeof metadata.plan_type === 'string') {
    const planType = metadata.plan_type as "free" | "basic" | "premium" | "enterprise";
    if (['free', 'basic', 'premium', 'enterprise'].includes(planType)) {
      return planType;
    }
  }
  
  // Análise baseada no nome do produto
  if (nameLower.includes("free") || nameLower.includes("gratuito") || nameLower.includes("aprendiz") || nameLower.includes("trial")) {
    return "free";
  }
  
  if (nameLower.includes("basic") || nameLower.includes("básico") || nameLower.includes("chef") || nameLower.includes("intermediário")) {
    return "basic";
  }
  
  if (nameLower.includes("premium") || nameLower.includes("master") || nameLower.includes("chef")) {
    return "premium";
  }
  
  if (nameLower.includes("enterprise") || nameLower.includes("empresarial")) {
    return "enterprise";
  }
  
  // Padrão baseado na posição ou metadados
  return "basic";
}

function getPlanFeatures(planType: string): string[] {
  switch (planType) {
    case "free":
      return [
        "Gerar Receitas: 2 por dia",
        "Salvar em Favoritas: até 5",
        "Histórico: não disponível",
        "Suporte por email",
      ];
    case "basic":
      return [
        "Gerar Receitas: 10 por dia",
        "Salvar em Favoritas: até 10",
        "Histórico: últimas 5 receitas geradas",
        "Receitas personalizadas",
        "Filtros avançados",
        "Suporte prioritário",
      ];
    case "premium":
      return [
        "Gerar Receitas: 20 por dia",
        "Salvar em Favoritas: ilimitado",
        "Histórico: ilimitado",
        "IA avançada para receitas",
        "Planejamento de refeições",
        "Lista de compras inteligente",
        "Receitas exclusivas",
      ];
    case "enterprise":
      return [
        "Todas as funcionalidades do Master Chef",
        "Integração com sistemas",
        "Relatórios avançados",
        "Suporte dedicado",
        "SLA garantido",
      ];
    default:
      return [];
  }
}
