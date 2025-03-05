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
import { useState } from "react";

export default function EditPasswordPage() {
  const { token } = useUserStore((state) => state.user);
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

  if (!token) {
    toast.error("You need to login to update your profile details");
    navigate("/login");
    return;
  }

  return (
    <div className="flex items-center justify-center pt-10 pb-10">
      <form
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
        className="rounded-md px-10 py-6 flex flex-col gap-2 w-[50%] shadow-md border border-gray-200"
      >
        <div className="flex justify-end">
          <Link
            to={`/profile`}
            className="rounded-full p-2 hover:bg-neutral-100 text-2xl duration-300"
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
            className="absolute inset-y-0 right-0 pr-3 mt-9 flex items-center cursor-pointer  h-fit w-fit"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
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
            className="absolute inset-y-0 right-0 pr-3 mt-9 flex items-center cursor-pointer  h-fit w-fit"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <div className="flex justify-end text-sm font-semibold gap-4 mt-8">
          <Button type="submit" buttonName={"Update"} />
        </div>
      </form>
    </div>
  );
}
