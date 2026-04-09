import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Product } from "../types";
import type { ProductFilters } from "../types";

export function useProducts(filters: ProductFilters = {}) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts(
        filters.category ?? null,
        filters.brand ?? null,
        filters.minPrice ?? null,
        filters.maxPrice ?? null,
        filters.minRating ?? null,
        filters.sortBy ?? null,
      );
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}
