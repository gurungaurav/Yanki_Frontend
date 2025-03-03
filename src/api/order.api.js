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

export const cancelOrder = async (id, jwt) => {
  return (
    await axiosInstance.delete(`/order/cancelOrder/${id}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
  ).data;
};

export const getSpecificUserOrders = async (jwt) => {
  console.log(jwt, "jwt");

  return (
    await axiosInstance.get("/order/getSpecificUserOrders", {
      headers: { Authorization: `Bearer ${jwt}` },
    })
  ).data;
};

export const getOrdersAdmin = async (filters) => {
  return (await axiosInstance.get("/order/getOrdersAdmin", { params: filters }))
    .data;
};

export const getSpecificOrder = async (id) => {
  return (await axiosInstance.get(`/order/getSpecificOrder/${id}`)).data;
};

export const updateOrderStatus = async (id, status, jwt) => {
  return (
    await axiosInstance.put(
      `/order/updateOrderStatus/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    )
  ).data;
};
