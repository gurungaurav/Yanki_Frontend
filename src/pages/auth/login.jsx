import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { LoginUser } from "../../api/auth.api";
import useUserStore from "../../store/useUserStore";
import TextInput from "../../components/textInput";
import Seo from "../../components/seo";

export default function LoginPage() {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  // Where to land after logging in. Sending everyone to "/" meant someone
  // bounced here from the cart lost their place in checkout.
  const redirectTo = location.state?.from ?? "/";

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const data = await LoginUser(values);
        toast.success(data.message);
        setUser({
          id: data.data.id,
          username: data.data.username,
          token: data.data.token,
          // Was dropped, so the admin dashboard link never appeared.
          role: data.data.role,
        });
        formik.resetForm();
        navigate(data.data.role === "admin" ? "/dashboard" : redirectTo, {
          replace: true,
        });
      } catch (error) {
        toast.error(error.response?.data?.message ?? "Could not log you in");
      }
    },
  });

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16">
      <Seo title="Log in" path="/login" noIndex />

      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-display text-4xl tracking-wide text-ink-950">
            Welcome back
          </h1>
          <p className="mt-2 text-gray-600">
            Log in to track orders and check out faster.
          </p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
          noValidate
        >
          <div className="flex flex-col gap-4">
            <TextInput
              label="Email"
              type="email"
              name="email"
              formik={formik}
              placeholder="you@example.com"
            />

            <div className="relative">
              <TextInput
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                formik={formik}
              />
              {/* Was a div with onClick: unreachable by keyboard and
                  invisible to screen readers. */}
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
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="mt-6 w-full rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-950 transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            {formik.isSubmitting ? "Logging in…" : "Log in"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            {/*
              This was a bare <button> inside the form. Buttons default to
              type="submit", so clicking it fired a login attempt as well as
              navigating.
            */}
            <Link
              to="/register"
              state={{ from: redirectTo }}
              className="font-semibold text-ink-950 underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
