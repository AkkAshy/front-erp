import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { attributeApi } from "../api/attributeApi";
import type { AttributeTypeList } from "../api/types";

export const useAttributeTypes = (params?: {
  offset?: number;
  limit?: number;
}): UseQueryResult<{ data: AttributeTypeList }, Error> => {
  return useQuery({
    queryKey: ["attributeTypes", params],
    queryFn: () => attributeApi.getAllTypes(params),
    staleTime: 5 * 60 * 1000,
  });
};
