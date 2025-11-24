import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

type WarehouseAddBatchRequest = {
  type: "variant" | "product";
  id: number;
  quantity: number;
  purchase_price: number;
  supplier?: number;
  manufacturing_date?: string;
  expiry_date?: string;
};

type WarehouseAddBatchResponse = {
  status: "success" | "error";
  message: string;
  batch?: {
    id: number;
    batch_number: string;
    quantity: number;
    purchase_price: number;
  };
  item?: {
    type: "variant" | "product";
    name: string;
    new_quantity: number;
  };
  error?: string;
};

export const useWarehouseAddBatch = (): UseMutationResult<
  { data: WarehouseAddBatchResponse },
  Error,
  WarehouseAddBatchRequest
> => {
  return useMutation({
    mutationFn: (data: WarehouseAddBatchRequest) =>
      productApi.warehouseAddBatch(data),
  });
};
