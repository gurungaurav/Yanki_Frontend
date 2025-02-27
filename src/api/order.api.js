import { axiosInstance } from "./index.api";

export const placeOrder = async (form, jwt) => {
  return (
    await axiosInstance.post("/order/placeOrder", form, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
  ).data;
};

export const verifyOrder = async (form, jwt) => {
  return (
    await axiosInstance.post("/order/verifyPayment", form, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
  ).data;
};
