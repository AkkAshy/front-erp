import { useMutation } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export const useUpdateBatch = () => {
  return useMutation({
    mutationFn: productApi.updateBatch,
  });
};
