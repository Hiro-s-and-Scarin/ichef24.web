import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

export class QueryUtils {
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  invalidateAuth() {
    this.queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    this.queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
  }

  invalidateRecipes() {
    this.queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
  }

  invalidateUserRecipes() {
    this.queryClient.invalidateQueries({
      queryKey: queryKeys.recipes.history(),
    });
    this.queryClient.invalidateQueries({
      queryKey: queryKeys.recipes.favorites(),
    });
  }

  invalidateUser(userId: string) {
    this.queryClient.invalidateQueries({
      queryKey: queryKeys.users.detail(userId),
    });
    this.queryClient.invalidateQueries({
      queryKey: queryKeys.users.preferences(userId),
    });
  }

  invalidatePlans() {
    this.queryClient.invalidateQueries({ queryKey: queryKeys.plans.all });
  }

  invalidateUserSubscription(userId: string) {
    this.queryClient.invalidateQueries({
      queryKey: queryKeys.plans.active(userId),
    });
    this.queryClient.invalidateQueries({
      queryKey: queryKeys.plans.billing(userId),
    });
  }

  prefetchRecipe(id: string) {
    return this.queryClient.prefetchQuery({
      queryKey: queryKeys.recipes.detail(id),
      queryFn: async () => {
        const { getRecipeById } = await import(
          "@/network/actions/recipes/actionRecipes"
        );
        return getRecipeById(id);
      },
    });
  }

  setRecipeData(id: string, data: any) {
    this.queryClient.setQueryData(queryKeys.recipes.detail(id), data);
  }

  getRecipeData(id: string) {
    return this.queryClient.getQueryData(queryKeys.recipes.detail(id));
  }

  removeQueries(queryKey: any[]) {
    this.queryClient.removeQueries({ queryKey });
  }

  clearAll() {
    this.queryClient.clear();
  }
}

export function createQueryUtils(queryClient: QueryClient) {
  return new QueryUtils(queryClient);
}
