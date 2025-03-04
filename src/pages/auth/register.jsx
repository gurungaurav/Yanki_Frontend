import { useFormik } from "formik";
import * as Yup from "yup";
import { RegisterUser } from "../../api/auth.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/textInput";
import Button from "../../components/button";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      address: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      username: Yup.string()
        .min(4, "Username must be at least 4 characters")
        .required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
      phoneNumber: Yup.string()
        .length(10, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
      address: Yup.string().required("Address is required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    try {
      const data = await RegisterUser(values);
      toast.success(data.message);
      formik.setSubmitting(false);
      formik.resetForm();
      navigate("/login");
      console.log("Form submitted");
    } catch (error) {
      console.log(error);
      formik.setSubmitting(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex my-20 items-center justify-center  p-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-2xl rounded-md bg-white p-8 shadow-md border border-gray-200 "
      >
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Create an Account
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <TextInput
              label="First Name"
              type="text"
              name="firstName"
              placeholder={"Enter your first name"}
              formik={formik}
            />
            <TextInput
              label="Last Name"
              type="text"
              name="lastName"
              placeholder={"Enter your last name"}
              formik={formik}
            />
          </div>

          {/* Email */}
          <TextInput label="Email" type="email" name="email" formik={formik} />

          <TextInput
            label="Username"
            type="text"
            name="username"
            placeholder={"Enter your username"}
            formik={formik}
          />

          <div className="flex gap-4">
            <TextInput
              label="Phone Number"
              type="text"
              name="phoneNumber"
              placeholder={"Enter your phone number"}
              formik={formik}
            />
            <TextInput
              label="Address"
              type="text"
              name="address"
              placeholder={"Enter your address"}
              formik={formik}
            />
          </div>

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

          <div className="relative">
            <TextInput
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder={"Confirm your password"}
              formik={formik}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 mt-9 flex items-center cursor-pointer  h-fit w-fit"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </div>

        <Button
          type={"submit"}
          className={"mt-6 w-full"}
          buttonName={"Register"}
        />

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-blue-500 hover:underline cursor-pointer "
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
