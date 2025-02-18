import { axiosInstance } from "./index.api";

export const getAllProducts = async (filters) => {
  console.log(filters, "as");

  return (await axiosInstance.get("/product/getProducts", { params: filters }))
    .data;
};

export const getSpecificProduct = async (productId) => {
  return (await axiosInstance.get(`/product/getProductById/${productId}`)).data;
};

export const addProduct = async (form) => {
  return (await axiosInstance.post("/product/addProduct", form)).data;
};

export const updateProduct = async (form, productId) => {
  return (await axiosInstance.post(`/product/updateProduct/${productId}`, form))
    .data;
};
export const softDeleteProduct = async (productId) => {
  return (await axiosInstance.patch(`/product/deleteProduct/${productId}`))
    .data;
};
