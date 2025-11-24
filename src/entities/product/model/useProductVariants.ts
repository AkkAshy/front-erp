import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export type VariantAttribute = {
  id: number;
  attribute: number;
  attribute_name: string;
  attribute_slug: string;
  value: number;
  value_text: string;
  created_at: string;
};

export type ProductVariant = {
  id: number;
  product: number;
  product_name: string;
  sku: string;
  barcode: string;
  price_override: number | null;  // Переопределенная цена продажи (null = использует цену родителя)
  image: string | null;
  is_active: boolean;
  order: number;
  attributes: VariantAttribute[];
  display_name: string;
  sale_price: string;  // Итоговая цена продажи (с учетом price_override или родителя)
  cost_price?: string;  // Цена закупки (от родителя или из партий) - optional
  quantity: string;
  created_at: string;
  updated_at: string;
};

export type ProductVariantsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductVariant[];
};

export const useProductVariants = (
  productId: number | null
): UseQueryResult<ProductVariantsResponse, Error> => {
  return useQuery({
    queryKey: ["product-variants", productId],
    queryFn: async () => {
      const response = await productApi.getVariantsByProduct(productId!);
      return response.data;
    },
    enabled: !!productId,
  });
};
