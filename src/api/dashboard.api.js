import { axiosInstance } from "./index.api";

export const getDashboardData = async () => {
  return (await axiosInstance.get("/admin/dashboard")).data;
};
