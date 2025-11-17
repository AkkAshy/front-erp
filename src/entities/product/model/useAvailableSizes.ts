import {
  useQuery,
  type UseQueryResult,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { productApi } from "../api/productApi";

type Size = {
  by_size: {
    size__size: string;
    total_stock: number;
  }[];
};

type SizeResponse = {
  data: Size;
};

export const useAvailableSizes = (
  params: { name: string },
  options?: Omit<UseQueryOptions<SizeResponse, Error>, "queryKey" | "queryFn">
): UseQueryResult<SizeResponse, Error> => {
  // Изменено здесь
  return useQuery({
    queryKey: ["availableSizes", params.name],
    queryFn: async () => {
      const response = await productApi.getAvailableSizes(params);
      return response as SizeResponse; // И здесь
    },
    enabled: !!params.name && (options?.enabled ?? true),
    ...options,
  });
};
