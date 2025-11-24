import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export type AttributeValue = {
  id: number;
  attribute: number;
  value: string;
  display_order: number;
};

export type AttributeValuesResponse = {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: AttributeValue[];
  };
};

export const useAttributeValues = (
  attributeId: number | null
): UseQueryResult<AttributeValuesResponse, Error> => {
  return useQuery({
    queryKey: ["attribute-values", attributeId],
    queryFn: () => productApi.getAttributeValues(attributeId!),
    enabled: !!attributeId,
  });
};
