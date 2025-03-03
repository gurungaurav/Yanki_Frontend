import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { changePassword } from "../../api/user.api";
import TextInput from "../../components/textInput";
import Button from "../../components/button";
import useUserStore from "../../store/useUserStore";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function EditPasswordPage() {
  const { token } = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string().required("New password is required"),
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
        console.log(res);
      } catch (error) {
        console.log("asasas");

        toast.error(error.response.data.message);
        console.error(error);
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
            className="rounded-full p-2 hover:bg-neutral-100 text-2xl"
          >
            <RxCross1 />
          </Link>
        </div>

        <TextInput
          label="Old Password"
          type="password"
          name="oldPassword"
          formik={formik}
        />
        <TextInput
          label="New Password"
          type="password"
          name="newPassword"
          formik={formik}
        />

        <div className="flex justify-end text-sm font-semibold gap-4 mt-10">
          <Button type="submit" buttonName={"Update"} />
        </div>
      </form>
    </div>
  );
}
