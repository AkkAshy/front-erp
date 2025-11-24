import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import type { AxiosResponse } from "axios";

export type CreateVariantData = {
  product: number;
  attributes: { attribute: number; value: number }[];
  price_override?: number;
};

export const useCreateVariant = (): UseMutationResult<
  AxiosResponse,
  Error,
  CreateVariantData
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVariantData) => productApi.createVariant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["variants"] });
    },
  });
};
