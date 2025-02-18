import { axiosInstance } from "./index.api";

export const getCategories = async () => {
  return (await axiosInstance.get("/category/getCategories")).data;
};

export const addCategory = async (category) => {
  return (await axiosInstance.post("/category/addCategory", category)).data;
};

export const deleteCategory = async (categoryId) => {
  return (await axiosInstance.delete(`/category/deleteCategory/${categoryId}`))
    .data;
};
