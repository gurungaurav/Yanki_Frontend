import { axiosInstance } from "./index.api";

export const sendContactUsMail = async (form) => {
  return (await axiosInstance.post("/message/addMessage", form)).data;
};

export const getContactUsMail = async () => {
  return (await axiosInstance.get("/message/getMessages")).data;
};
