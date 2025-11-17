import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";

export const useToggleActiveUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.toggleActiveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"], 
      });
    },
  });
};

