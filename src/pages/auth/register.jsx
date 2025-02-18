import { useFormik } from "formik";
import * as Yup from "yup";
import { RegisterUser } from "../../api/auth.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage() {
  const navigate = useNavigate();

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
        .max(10, "Phone number must be at least 10 digits")
        .min(10, "Phone number must be at least 10 digits")
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
    <div className="flex min-h-screen items-center justify-center  p-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl backdrop-blur-lg border border-gray-200"
      >
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Create an Account
        </h1>

        <div className="flex gap-4">
          {/* First Name */}
          <div className="relative mb-6">
            <label
              htmlFor="firstName"
              className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600"
            >
              First Name
            </label>
            <input
              className={`w-full rounded-lg border-2 p-3 text-gray-700 focus:ring-4 focus:ring-blue-300 ${
                formik.touched.firstName && formik.errors.firstName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              name="firstName"
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="relative mb-6">
            <label
              htmlFor="lastName"
              className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600"
            >
              Last Name
            </label>
            <input
              className={`w-full rounded-lg border-2 p-3 text-gray-700 focus:ring-4 focus:ring-blue-300 ${
                formik.touched.lastName && formik.errors.lastName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              name="lastName"
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="relative mb-6">
          <label
            htmlFor="email"
            className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600"
          >
            Email
          </label>
          <input
            className={`w-full rounded-lg border-2 p-3 text-gray-700 focus:ring-4 focus:ring-blue-300 ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
            name="email"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
          )}
        </div>

        {/* Username */}
        <div className="relative mb-6">
          <label
            htmlFor="username"
            className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600"
          >
            Username
          </label>
          <input
            className={`w-full rounded-lg border-2 p-3 text-gray-700 focus:ring-4 focus:ring-blue-300 ${
              formik.touched.username && formik.errors.username
                ? "border-red-500"
                : "border-gray-300"
            }`}
            name="username"
            id="username"
            type="text"
            placeholder="Choose a username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.username}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <label
            htmlFor="password"
            className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600"
          >
            Password
          </label>
          <input
            className={`w-full rounded-lg border-2 p-3 text-gray-700 focus:ring-4 focus:ring-blue-300 ${
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : "border-gray-300"
            }`}
            name="password"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative mb-6">
          <label
            htmlFor="confirmPassword"
            className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600"
          >
            Confirm Password
          </label>
          <input
            className={`w-full rounded-lg border-2 p-3 text-gray-700 focus:ring-4 focus:ring-blue-300 ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            }`}
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="relative mb-6">
          <label
            htmlFor="phoneNumber"
            className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600"
          >
            Phone Number
          </label>
          <input
            className={`w-full rounded-lg border-2 p-3 text-gray-700 focus:ring-4 focus:ring-blue-300 ${
              formik.touched.phoneNumber && formik.errors.phoneNumber
                ? "border-red-500"
                : "border-gray-300"
            }`}
            name="phoneNumber"
            id="phoneNumber"
            type="text"
            placeholder="Enter your phone number"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.phoneNumber}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="relative mb-8">
          <label
            htmlFor="address"
            className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600"
          >
            Address
          </label>
          <input
            className={`w-full rounded-lg border-2 p-3 text-gray-700 focus:ring-4 focus:ring-blue-300 ${
              formik.touched.address && formik.errors.address
                ? "border-red-500"
                : "border-gray-300"
            }`}
            name="address"
            id="address"
            type="text"
            placeholder="Enter your address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.address && formik.errors.address && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.address}</p>
          )}
        </div>

        <button
          type="submit"
          // disabled={!formik.isValid || formik.isSubmitting}
          className="w-full rounded-lg bg-gradient-to-r cursor-pointer bg-gray-800 duration-300 py-3 text-lg font-semibold text-white shadow-lg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Register
        </button>
      </form>
    </div>
  );
}
