import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import type { Size } from "../api/types";

export const useSizes = (): UseQueryResult<{ data: Size }, Error> => {
  return useQuery({
    queryKey: ["sizes"],
    queryFn: () => productApi.getAllSizes(),
  });
};
