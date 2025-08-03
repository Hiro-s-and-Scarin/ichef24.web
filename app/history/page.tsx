import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getMyRecipes } from "@/network/actions/recipes/actionRecipes";
import { HistoryPageContent } from "@/components/pages/history-page";

export default async function HistoryPage() {
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ["recipes", "my-recipes"],
    queryFn: async () => {
      try {
        return await getMyRecipes({});
      } catch (error) {
        console.error("Erro ao pré-buscar receitas do usuário durante o build:", error);
        return [];
      }
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HistoryPageContent />
    </HydrationBoundary>
  );
}