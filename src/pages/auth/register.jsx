import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { RegisterUser } from "../../api/auth.api";
import TextInput from "../../components/textInput";
import Seo from "../../components/seo";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const redirectTo = location.state?.from ?? "/";

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
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
      address: Yup.string().required("Address is required"),
    }),
    onSubmit: async (values) => {
      try {
        const data = await RegisterUser(values);
        toast.success(data.message);
        formik.resetForm();
        // Keep the original destination so checkout can resume after login.
        navigate("/login", { state: { from: redirectTo } });
      } catch (error) {
        toast.error(
          error.response?.data?.message ?? "Could not create your account"
        );
      }
    },
  });

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16">
      <Seo title="Create an account" path="/register" noIndex />

      <div className="w-full max-w-2xl">
        <div className="text-center">
          <h1 className="font-display text-4xl tracking-wide text-ink-950">
            Create an account
          </h1>
          <p className="mt-2 text-gray-600">
            Save your details and check out faster next time.
          </p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="First name"
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              formik={formik}
            />
            <TextInput
              label="Last name"
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              formik={formik}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              formik={formik}
            />
            <TextInput
              label="Username"
              type="text"
              name="username"
              placeholder="Choose a username"
              formik={formik}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Phone number"
              type="tel"
              name="phoneNumber"
              placeholder="98XXXXXXXX"
              formik={formik}
            />
            <TextInput
              label="Address"
              type="text"
              name="address"
              placeholder="Street, area, city"
              formik={formik}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <TextInput
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="At least 6 characters"
                formik={formik}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-9 text-gray-500 transition-colors hover:text-ink-950"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="relative">
              <TextInput
                label="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter your password"
                formik={formik}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="absolute right-3 top-9 text-gray-500 transition-colors hover:text-ink-950"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* The button had no disabled state, so it could be submitted
              repeatedly while the first request was still in flight. */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="mt-6 w-full rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-950 transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            {formik.isSubmitting ? "Creating account…" : "Create account"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              state={{ from: redirectTo }}
              className="font-semibold text-ink-950 underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
