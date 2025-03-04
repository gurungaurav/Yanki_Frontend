import { CiMail } from "react-icons/ci";
import { HiLocationMarker } from "react-icons/hi";
import { useFormik } from "formik";
import { BiSolidPhoneCall } from "react-icons/bi";
import { FaFacebookF } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { sendContactUsMail } from "../api/message.api";
import Button from "../components/button";

export default function ContactUs() {
  return (
    <div className="w-full h-full flex flex-col gap-20 items-center justify-center mt-10 mb-10">
      <div className=" w-[70%] ">
        <div className="flex items-center justify-center flex-col mb-10 gap-2">
          <h3 className="text-4xl font-bold tracking-wide ">Contact Us</h3>
          <p className="font-bold text-gray-600">
            Any question or remarks? Just write us a message
          </p>
        </div>
        <div className=" flex items-center justify-center rounded-lg shadow-md border border-gray-200 h-[34rem] ">
          <div className="w-[40%] h-full flex flex-col gap-24 p-8 px-10 bg-gray-900 rounded-l-md text-white">
            <div>
              <h2 className="text-[28px] font-semibold">Contact Information</h2>
              {/* <p className="text-md mt-2">Say something to start a live chat</p> */}
            </div>
            <div className="flex flex-col gap-12">
              <div className="flex text-md items-center gap-5">
                <BiSolidPhoneCall className="text-xl" />
                <p>number</p>
              </div>
              <div className="flex text-md items-center gap-5">
                <CiMail className="text-xl" />
                <p>ge@gmail.com</p>
              </div>
              <div className="flex text-md items-center gap-5">
                <HiLocationMarker className="text-xl" />
                <p>location</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div
                onClick={() =>
                  window.open("https://www.facebook.com", "_blank")
                }
                className="border-2 border-white rounded-full p-2  hover:bg-white ease-in duration-500 hover:text-black cursor-pointer"
              >
                <FaFacebookF className="text-xl" />
              </div>

              <div
                onClick={() =>
                  window.open("https://www.instagram.com", "_blank")
                }
                className="border-2 border-white rounded-full p-2   hover:bg-white ease-in duration-500 hover:text-black cursor-pointer"
              >
                <RiInstagramFill className="text-xl" />
              </div>
            </div>
          </div>
          <div className="w-[60%] h-full rounded-r-lg pt-10">
            <ContactUsForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactUsForm() {
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    errors,
    resetForm,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: async (values) => {
      await sendMessage(values);
    },
  });

  const sendMessage = async (form) => {
    try {
      const res = await sendContactUsMail(form);
      console.log(res.data);
      toast.success(res.message);
      resetForm();
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  return (
    <form className="flex flex-col gap-6 px-16" onSubmit={handleSubmit}>
      <div className="flex-1 h-[6rem]">
        <label htmlFor="name" className="block text-sm font-medium text-black">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className="pt-2 pb-2  border-b-2 border-gray-400  text-black w-full transition focus:border-black outline-none"
        />
        {touched.name && errors.name ? (
          <p className="text-red-600">{errors.name}</p>
        ) : null}
      </div>

      <div className="flex w-full">
        <div className="w-full">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-black"
          >
            Message
          </label>
          <textarea
            type="text"
            id="message"
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Write your message..."
            className=" pt-2 pb-10 border-b-2 border-gray-400  text-black w-full transition focus:border-black outline-none"
          />
          {touched.message && errors.message ? (
            <p className="text-red-600">{errors.message}</p>
          ) : null}
        </div>
      </div>
      <div className="flex justify-end w-full ">
        <Button buttonName="Send" type="submit" className="w-32 " />
      </div>
    </form>
  );
}
