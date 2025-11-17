import { useMutation } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export const useAddBatch = () => {
  return useMutation({
    mutationFn: productApi.addBatch,
  });
};
