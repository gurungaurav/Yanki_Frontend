import { axiosInstance } from "./index.api";

export const getProductReviews = async (productId, isDeleted) => {
  console.log(isDeleted);

  return (
    await axiosInstance.get(`/review/getAllReviews/${productId}`, {
      params: { isDeleted },
    })
  ).data;
};

export const addProductReviews = async (review, jwt) => {
  console.log(review, "review", jwt, "jwt");

  return (
    await axiosInstance.post(`/review/addReview`, review, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
  ).data;
};

export const softDeleteProductReviews = async (reviewId) => {
  return (await axiosInstance.delete(`/review/deleteReview/${reviewId}`)).data;
};
