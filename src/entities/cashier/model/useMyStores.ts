import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { MyStoresResponse } from "../api/types";

export const useMyStores = (): UseQueryResult<MyStoresResponse, Error> => {
  return useQuery({
    queryKey: ["my-stores-with-credentials"],
    queryFn: async () => {
      const res = await usersApi.getMyStoresWithCredentials();
      return res.data;
    },
  });
};
