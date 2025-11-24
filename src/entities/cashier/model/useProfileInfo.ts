import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { usersApi } from "../api/usersApi";
import type { ProfileResponse } from "../api/types";

export const useProfileInfo = (): UseQueryResult<AxiosResponse<ProfileResponse>, Error> => {
  return useQuery({
    queryKey: ["profile-info"],
    queryFn: () => usersApi.profileInfo(),
  });
};
