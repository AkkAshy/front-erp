import { useQuery } from "@tanstack/react-query";
import { attributeApi } from "../api/attributeApi";

export const useAttributeValues = (params?: {
  attribute?: number; // Изменено с attribute_type
  offset?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["attributeValues", params],
    queryFn: async () => {
      const response = await attributeApi.getAllValues(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!params?.attribute, // Изменено с attribute_type
  });
};
