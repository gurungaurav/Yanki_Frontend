import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { LoginUser } from "../../api/auth.api";
import useUserStore from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
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
      console.log("Form submitted");

      if (data.data.role === "admin") {
        navigate("/dashboard");
        return;
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      formik.setSubmitting(false);
      toast.error(error.response.data.message);
    }
  };
  console.log(formik.isSubmitting, "dsd");

  return (
    <div className="flex min-h-screen items-center justify-center  p-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl backdrop-blur-lg border border-gray-200"
      >
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Welcome Back
        </h1>

        {/* Email Input */}
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

        {/* Password Input */}
        <div className="relative mb-8">
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r cursor-pointer bg-gray-800 duration-300 py-3 text-lg font-semibold text-white shadow-lg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          //   disabled={!formik.isValid || formik.isSubmitting}
        >
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </button>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="font-medium text-blue-500 hover:underline "
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
