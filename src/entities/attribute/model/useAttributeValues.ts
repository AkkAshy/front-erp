import { useQuery } from "@tanstack/react-query";
import { attributeApi } from "../api/attributeApi";

export const useAttributeValues = (params?: {
  attribute?: number; // Изменено с attribute_type
  offset?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["attributeValues", params],
    queryFn: () => attributeApi.getAllValues(params),
    staleTime: 5 * 60 * 1000,
    enabled: !!params?.attribute, // Изменено с attribute_type
  });
};
