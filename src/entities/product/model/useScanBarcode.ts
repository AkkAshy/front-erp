import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

// Новый warehouse scan API response
export type VariantScanData = {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  barcode: string;
  display_name: string;
  current_quantity: number;
  price: number;
  attributes: Array<{
    attribute: string;
    value: string;
  }>;
};

export type ProductScanData = {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  current_quantity: number;
  price: number;
};

export type ScanBarcodeResponse = {
  status: "found" | "not_found";
  type?: "variant" | "product";
  data?: VariantScanData | ProductScanData;
  message?: string;
  barcode?: string;
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
