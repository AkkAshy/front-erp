import { useMutation } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";

export const useUpdateUser = () => {
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
