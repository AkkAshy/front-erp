import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { unitApi } from "../api/unitApi";
import type { Units } from "../api/types";

export const useUnits = (): UseQueryResult<{ data: Units }, Error> => {
  return useQuery({
    queryKey: ["units"],
    queryFn: unitApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
};
