import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCommunityPosts, getTopChefs, getTrendingPosts } from "@/network/actions/users/actionUsers";
import { CommunityPageContent } from "@/components/pages/community-page";

export default async function CommunityPage() {
  const queryClient = new QueryClient();
  
  // Prefetch all community data
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["users", "community"],
      queryFn: async () => {
        try {
          return await getCommunityPosts({});
        } catch (error) {
          console.error("Erro ao pré-buscar posts da comunidade durante o build:", error);
          return [];
        }
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["users", "top-chefs"],
      queryFn: async () => {
        try {
          return await getTopChefs();
        } catch (error) {
          console.error("Erro ao pré-buscar top chefs durante o build:", error);
          return [];
        }
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["users", "trending"],
      queryFn: async () => {
        try {
          return await getTrendingPosts();
        } catch (error) {
          console.error("Erro ao pré-buscar posts em alta durante o build:", error);
          return [];
        }
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommunityPageContent />
    </HydrationBoundary>
  );
}