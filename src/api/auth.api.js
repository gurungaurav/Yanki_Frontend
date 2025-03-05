import { axiosInstance } from "./index.api";

export const RegisterUser = async (form) => {
  return (await axiosInstance.post("/auth/register", form)).data;
};

export const LoginUser = async (form) => {
  return (await axiosInstance.post("/auth/login", form)).data;
};

export const getUsers = async () => {
  return (await axiosInstance.get("/user/getUsers")).data;
};
