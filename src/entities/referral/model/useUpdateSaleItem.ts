import { useMutation, useQueryClient } from "@tanstack/react-query";
import { referralApi } from "../api/referralApi";

type UpdateSaleItemRequest = {
  saleId: number;
  itemId: number;
  unit_price?: number;
  quantity?: number;
};

// Изменить цену/количество товара в чеке
export const useUpdateSaleItem = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, UpdateSaleItemRequest>({
    mutationFn: async ({ saleId, itemId, unit_price, quantity }) => {
      const response = await referralApi.updateItemInSale(saleId, {
        item_id: itemId,
        unit_price,
        quantity,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentSale"] });
    },
  });
};
