export const queryConfig = {
  defaultQueries: {
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount: number, error: unknown) => {
      if ((error as { response?: { status?: number } })?.response?.status === 404) return false;
      return failureCount < 1;
    },
  },

  frequentQueries: {
    staleTime: 10 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  staticQueries: {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  mutations: {
    retry: 0,
  },
};

export function getQueryConfig(
  type: "default" | "frequent" | "static" = "default",
) {
  return (
    queryConfig[`${type}Queries` as keyof typeof queryConfig] ||
    queryConfig.defaultQueries
  );
}
