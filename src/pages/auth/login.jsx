import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { LoginUser } from "../../api/auth.api";
import useUserStore from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/textInput";
import Button from "../../components/button";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    try {
      const data = await LoginUser(values);
      toast.success(data.message);
      setUser({
        id: data.data.id,
        username: data.data.username,
        token: data.data.token,
      });
      formik.setSubmitting(false);
      formik.resetForm();

      if (data.data.role === "admin") {
        navigate("/dashboard");
        return;
      } else {
        navigate("/");
      }
    } catch (error) {
      formik.setSubmitting(false);
      toast.error(error.response.data.message);
    }
  };
  console.log(formik.isSubmitting, "dsd");

  return (
    <div className="flex my-20 center justify-center p-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl backdrop-blur-lg border border-gray-200"
      >
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Welcome Back
        </h1>
        <div className="flex flex-col gap-4">
          {/* Email Input */}
          <TextInput
            label="Email"
            type="email"
            name="email"
            formik={formik}
            placeholder="Enter your email"
          />

          {/* Password Input */}
          <div className="relative">
            <TextInput
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={"Enter your password"}
              formik={formik}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 mt-9 flex items-center cursor-pointer  h-fit w-fit"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className={"mt-6 w-full"}
          buttonName={formik.isSubmitting ? "Loading..." : "Login"}
        />

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-medium text-blue-500 hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
