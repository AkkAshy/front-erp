import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import type { ProductItem } from "../api/types";

// Backend response structure - ИСПРАВЛЕНО согласно реальному API
// Backend возвращает товар напрямую в data, а не в data.product
type ScanBarcodeResponse = {
  status: "success";
  data: ProductItem;  // Товар напрямую, без обертки {product: ...}
};

export const useScanBarcode = (
  barcode: string,
  enabled: boolean = true
): UseQueryResult<ScanBarcodeResponse, Error> => {
  const isEnabled = !!barcode && enabled;

  console.log('🔍 useScanBarcode called:', {
    barcode,
    enabled,
    isEnabled,
    barcodeLength: barcode?.length
  });

  return useQuery({
    queryKey: ["product", "scan", barcode],
    queryFn: async () => {
      console.log('🌐 Calling scanBarcode API with:', barcode);
      const response = await productApi.scanBarcode(barcode);
      console.log('📦 scanBarcode API response:', response);
      console.log('📦 response.data:', response.data);
      return response.data;
    },
    enabled: isEnabled,
    retry: false,
    staleTime: 0,  // Не кешировать
    gcTime: 0,     // Сразу удалять из кеша
  });
};
