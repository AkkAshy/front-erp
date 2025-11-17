import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attributeApi } from "../api/attributeApi";
import type { CreateAttributeType } from "../api/types";

export const useCreateAttributeType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttributeType) => attributeApi.createType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributeTypes"] });
    },
  });
};
