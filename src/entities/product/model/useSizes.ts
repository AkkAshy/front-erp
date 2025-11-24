import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import type { Size } from "../api/types";

export const useSizes = (): UseQueryResult<Size, Error> => {
  return useQuery({
    queryKey: ["sizes"],
    queryFn: async () => {
      const response = await productApi.getAllSizes();
      return response.data;
    },
  });
};
