import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Product, Review } from "../types";

export function useProduct(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product | null>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductReviews(productId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductReviews(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddReview(productId: string) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      authorName,
      rating,
      title,
      body,
    }: {
      userId: string;
      authorName: string;
      rating: bigint;
      title: string;
      body: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addReview(
        productId,
        userId,
        authorName,
        rating,
        title,
        body,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
}
