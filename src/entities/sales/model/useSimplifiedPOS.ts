import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { salesApi } from "../api/salesApi";
import type {
  ScanItemRequest,
  ScanItemResponse,
  CurrentSaleResponse,
  AddItemRequest,
  RemoveItemRequest,
  CheckoutRequest,
  CheckoutResponse,
} from "./types";

// ===== SIMPLIFIED POS HOOKS =====
// Хуки для упрощенного POS workflow: scan → sell

/**
 * Scan barcode and auto-create/update draft sale
 * POST /api/sales/scan-item/
 */
export const useScanItem = () => {
  const queryClient = useQueryClient();

  return useMutation<ScanItemResponse, Error, ScanItemRequest>({
    mutationFn: (data) => salesApi.scanItem(data),
    onSuccess: () => {
      // Invalidate current sale to refresh the cart
      queryClient.invalidateQueries({ queryKey: ["currentSale"] });
    },
  });
};

/**
 * Get current pending sale for session
 * GET /api/sales/current/?session={session_id}
 */
export const useCurrentSale = (session: number | null) => {
  return useQuery<CurrentSaleResponse>({
    queryKey: ["currentSale", session],
    queryFn: () => salesApi.getCurrentSale(session!),
    enabled: !!session, // Only fetch if session exists
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });
};

/**
 * Add item to existing sale (manual add without barcode)
 * POST /api/sales/{sale_id}/add-item/
 */
export const useAddItemToSale = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { saleId: number; data: AddItemRequest }>({
    mutationFn: ({ saleId, data }) => salesApi.addItemToSale(saleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentSale"] });
    },
  });
};

/**
 * Remove item from sale
 * DELETE /api/sales/sales/{sale_id}/remove-item/
 */
export const useRemoveItemFromSale = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { saleId: number; itemId: number }>({
    mutationFn: ({ saleId, itemId }) =>
      salesApi.removeItemFromSale(saleId, { item_id: itemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentSale"] });
    },
  });
};

/**
 * Complete sale with payments
 * POST /api/sales/{sale_id}/checkout/
 */
export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation<CheckoutResponse, Error, { saleId: number; data: CheckoutRequest }>({
    mutationFn: ({ saleId, data }) => salesApi.checkout(saleId, data),
    onSuccess: () => {
      // Clear current sale
      queryClient.invalidateQueries({ queryKey: ["currentSale"] });
      // Refresh sales list
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      // Refresh today's sales
      queryClient.invalidateQueries({ queryKey: ["todaySales"] });
    },
  });
};
