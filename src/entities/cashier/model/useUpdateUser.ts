import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.updateUser,
    // НЕ инвалидируем кэш здесь - это делается вручную после всей цепочки обновлений
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["users"],
    //   });
    // },
  });
};
