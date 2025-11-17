import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export const useInventoryStats = () => {
  return useQuery({
    queryKey: ["inventory-stats"],
    queryFn: productApi.getInventoryStats,
    staleTime: 10 * 60 * 1000, // 10 минут
  });
};
