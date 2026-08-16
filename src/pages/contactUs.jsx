import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Mail, Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { sendContactUsMail } from "../api/message.api";
import Seo from "../components/seo";
import { cn } from "../lib/utils";

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: "Phone",
    value: "+977 980-000-0000",
    href: "tel:+9779800000000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@yanki.com",
    href: "mailto:hello@yanki.com",
  },
  { icon: MapPin, label: "Address", value: "New Road, Kathmandu, Nepal" },
  { icon: Clock, label: "Hours", value: "Sunday–Friday, 10am–6pm" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/yanki", icon: Instagram },
  { label: "Facebook", href: "https://facebook.com/yanki", icon: Facebook },
];

export default function ContactUs() {
  return (
    <div className="bg-white">
      <Seo
        title="Contact Us"
        description="Questions about a tool, an order or bulk pricing? Get in touch with the Yanki team — we reply Sunday to Friday, 10am to 6pm."
        path="/contact-us"
      />

      <div className="container-page py-12 lg:py-20">
        <header className="max-w-2xl">
          {/* Was an <h3>, so the page had no h1 at all. */}
          <h1 className="font-display text-5xl tracking-wide text-ink-950 sm:text-6xl">
            Contact us
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Questions about a tool, an order, or bulk pricing for your shop?
            Send us a message and we&apos;ll get back to you.
          </p>
        </header>

        <div className="mt-12 grid overflow-hidden rounded-2xl border border-gray-200 lg:grid-cols-5">
          {/* Details */}
          <div className="bg-ink-950 p-8 lg:col-span-2 lg:p-10">
            <h2 className="font-display text-2xl tracking-wide text-white">
              Contact information
            </h2>

            <ul className="mt-8 space-y-6">
              {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-4">
                  <Icon
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand-500"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-ink-100 transition-colors hover:text-brand-500"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-ink-100">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <ul className="mt-10 flex gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  {/* These were divs with onClick — unreachable by keyboard,
                      and they pointed at facebook.com rather than the brand. */}
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Yanki on ${label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-brand-500 hover:bg-brand-500 hover:text-ink-950"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="p-8 lg:col-span-3 lg:p-10">
            <ContactUsForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactUsForm() {
  const formik = useFormik({
    initialValues: { name: "", email: "", message: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),
      message: Yup.string()
        .min(10, "Please give us a little more detail")
        .required("Message is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await sendContactUsMail(values);
        toast.success(res.message ?? "Message sent — we'll be in touch.");
        resetForm();
      } catch (e) {
        toast.error(
          e.response?.data?.message ?? "Could not send your message"
        );
      }
    },
  });

  const fieldError = (name) => formik.touched[name] && formik.errors[name];

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
      <Field
        name="name"
        label="Your name"
        placeholder="Enter your name"
        formik={formik}
        error={fieldError("name")}
      />

      {/*
        The email field existed in the form's initial values but was never
        rendered, so submissions arrived with no reply address.
      */}
      <Field
        name="email"
        type="email"
        label="Email address"
        placeholder="you@example.com"
        formik={formik}
        error={fieldError("email")}
      />

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-ink-950"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="How can we help?"
          aria-invalid={Boolean(fieldError("message"))}
          className={cn(
            "mt-2 block w-full resize-none rounded-lg border p-3 text-sm transition-colors focus:border-ink-950",
            fieldError("message") ? "border-red-500" : "border-gray-300"
          )}
        />
        {fieldError("message") && (
          <p className="mt-1.5 text-sm text-red-600">{formik.errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-950 transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 sm:w-auto"
      >
        {formik.isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({ name, label, type = "text", placeholder, formik, error }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink-950">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={cn(
          "mt-2 block w-full rounded-lg border p-3 text-sm transition-colors focus:border-ink-950",
          error ? "border-red-500" : "border-gray-300"
        )}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
