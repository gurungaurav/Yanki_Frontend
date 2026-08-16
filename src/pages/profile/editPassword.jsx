import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { changePassword } from "../../api/user.api";
import TextInput from "../../components/textInput";
import Button from "../../components/button";
import useUserStore from "../../store/useUserStore";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function EditPasswordPage() {
  const loggedUser = useUserStore((state) => state.user);
  const token = loggedUser?.token;
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await changePassword(token, values);
        toast.success(res.message);
        navigate("/profile");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error("You need to login to change your password");
      navigate("/login");
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center  px-4 py-8 md:py-16">
      <form
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
        className="rounded-md px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 flex flex-col gap-3 md:gap-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl shadow-md border border-gray-200 bg-white"
      >
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
            Change Password
          </h2>
          <Link
            to={`/profile`}
            className="rounded-full p-2 hover:bg-neutral-100 text-lg sm:text-xl md:text-2xl duration-300"
          >
            <RxCross1 />
          </Link>
        </div>

        <div className="relative">
          <TextInput
            label="Old Password"
            type={showOldPassword ? "text" : "password"}
            name="oldPassword"
            placeholder="Enter your old password"
            formik={formik}
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 mt-7 sm:mt-8 md:mt-9 flex items-center cursor-pointer h-fit w-fit"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? (
              <FaEyeSlash className="text-sm md:text-base" />
            ) : (
              <FaEye className="text-sm md:text-base" />
            )}
          </div>
        </div>

        <div className="relative">
          <TextInput
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            placeholder={"Enter your new password"}
            formik={formik}
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 mt-7 sm:mt-8 md:mt-9 flex items-center cursor-pointer h-fit w-fit"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? (
              <FaEyeSlash className="text-sm md:text-base" />
            ) : (
              <FaEye className="text-sm md:text-base" />
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end text-sm font-semibold gap-3 md:gap-4 mt-6 md:mt-8">
          <Button
            type="button"
            buttonName="Cancel"
            className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600"
            handleOnClick={() => navigate("/profile")}
          />
          <Button
            type="submit"
            buttonName={"Update"}
            className="w-full sm:w-auto"
          />
        </div>
      </form>
    </div>
  );
}
