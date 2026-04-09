import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Order } from "../types";

export function useOrders(userId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Order[]>({
    queryKey: ["orders", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getOrders(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: 1000 * 60 * 1,
  });
}

export function useOrder(id: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Order | null>({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getOrder(id);
    },
    enabled: !!actor && !isFetching && !!id,
    staleTime: 1000 * 60 * 1,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      shippingAddress,
    }: {
      userId: string;
      shippingAddress: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.placeOrder(userId, shippingAddress);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["orders", userId] });
    },
  });
}
