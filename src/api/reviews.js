import { axiosInstance } from "./index.api";

export const getProductReviews = async (productId, isDeleted) => {
  console.log(isDeleted);

  return (
    await axiosInstance.get(`/review/getAllReviews/${productId}`, {
      params: { isDeleted },
    })
  ).data;
};

export const addProductReviews = async (review) => {
  return (await axiosInstance.post(`/review/addReview`, review)).data;
};

export const softDeleteProductReviews = async (reviewId, isDeleted) => {
  return (
    await axiosInstance.patch(`/review/deleteReview/${reviewId}`, {
      isDeleted,
    })
  ).data;
};
