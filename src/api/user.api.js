import { axiosInstance } from "./index.api";

export const getUserDetailById = async (jwt) => {
  return (
    await axiosInstance.get(`/user/getSpecificUser`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
  ).data;
};

export const getAllUsers = async () => {
  return (await axiosInstance.get(`/user/getAllUsers`)).data;
};

export const updateUserProfile = async (jwt, data) => {
  return (
    await axiosInstance.put(`/user/updateUser`, data, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
  ).data;
};

export const changePassword = async (jwt, data) => {
  return (
    await axiosInstance.patch(`/user/changePassword`, data, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
  ).data;
};
