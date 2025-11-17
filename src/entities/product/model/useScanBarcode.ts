import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import type { ProductItem } from "../api/types";

type ProductResponse = {
  found: boolean;
  product: ProductItem;
};

export const useScanBarcode = (
  barcode: string,
  enabled: boolean = true
): UseQueryResult<
  {
    data: ProductResponse;
  },
  Error
> => {
  return useQuery({
    queryKey: ["product", "scan", barcode],
    queryFn: () => productApi.scanBarcode(barcode),
    enabled: !!barcode && enabled,
    retry: false,
  });
};
