import { axiosInstance } from "./index.api";

export const getProductReviews = async (productId) => {
  return (await axiosInstance.get(`/review/getAllReviews/${productId}`)).data;
};

export const addProductReviews = async (review) => {
  return (await axiosInstance.post(`/review/addReview`, review)).data;
};
