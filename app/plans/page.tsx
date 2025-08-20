import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getPlans } from "@/network/actions/plans/actionPlans";
import { PlansPageContent } from "@/components/feature/pages/plans-page";

export default async function PlansPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["plans", "all"],
    queryFn: async () => {
      try {
        return await getPlans();
      } catch (error) {
        console.error("Erro ao pré-buscar planos durante o build:", error);
        return [];
      }
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlansPageContent />
    </HydrationBoundary>
  );
}
