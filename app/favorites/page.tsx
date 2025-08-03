import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getFavoriteRecipes } from "@/network/actions/recipes/actionRecipes";
import { FavoritesPageContent } from "@/components/pages/favorites-page";

export default async function FavoritesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["recipes", "favorites"],
    queryFn: async () => {
      try {
        return await getFavoriteRecipes({});
      } catch (error) {
        console.error("Erro ao pré-buscar favoritos durante o build:", error);
        return [];
      }
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FavoritesPageContent />
    </HydrationBoundary>
  );
}