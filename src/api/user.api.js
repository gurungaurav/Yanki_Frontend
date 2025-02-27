import { axiosInstance } from "./index.api";

export const getUserDetailById = async (jwt) => {
  return (
    await axiosInstance.get(`/user/getSpecificUser`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
  ).data;
};
