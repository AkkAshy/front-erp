import { useMutation } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: usersApi.changePassword,
    // НЕ инвалидируем кэш здесь - это делается вручную после всей цепочки обновлений
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["users"],
    //   });
    // },
  });
};
