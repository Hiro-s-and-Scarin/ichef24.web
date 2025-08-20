import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getStripeProducts } from "@/network/actions/stripe";
import { PlansPageContent } from "@/components/feature/pages/plans-page";

export default async function PlansPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["stripe", "products"],
    queryFn: async () => {
      try {
        return await getStripeProducts();
      } catch (error) {
        // Error during build-time fetching
        return { success: false, data: [], message: "Erro ao carregar produtos" };
      }
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlansPageContent />
    </HydrationBoundary>
  );
}
