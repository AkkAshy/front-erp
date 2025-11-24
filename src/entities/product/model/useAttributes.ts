import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export type AttributeValue = {
  id: number;
  attribute: number;
  value: string;
  order: number;
  is_active: boolean;
  created_at: string;
};

export type Attribute = {
  id: number;
  name: string;
  slug: string;
  type: string;
  type_display: string;
  description: string;
  is_required: boolean;
  is_filterable: boolean;
  order: number;
  is_active: boolean;
  created_at: string;
  values: AttributeValue[];
};

export type AttributesResponse = {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Attribute[];
  };
};

export const useAttributes = (): UseQueryResult<AttributesResponse["data"], Error> => {
  return useQuery({
    queryKey: ["attributes"],
    queryFn: async () => {
      const response = await productApi.getAllAttributes();
      return response.data;
    },
  });
};
