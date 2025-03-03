import { axiosInstance } from "./index.api";

export const getCategories = async (isDeleted) => {
  return (
    await axiosInstance.get("/category/getCategories", { params: isDeleted })
  ).data;
};

export const addCategory = async (category) => {
  return (await axiosInstance.post("/category/addCategory", category)).data;
};

export const deleteCategory = async (categoryId) => {
  return (await axiosInstance.delete(`/category/deleteCategory/${categoryId}`))
    .data;
};

export const updateCategory = async (categoryId, categoryName) => {
  console.log(categoryName, "asas", categoryId);

  return (
    await axiosInstance.put(`/category/updateCategory/${categoryId}`, {
      name: categoryName,
    })
  ).data;
};
