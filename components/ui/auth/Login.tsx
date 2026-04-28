"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { 
  FiAlertCircle, 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiRefreshCw 
} from "react-icons/fi";
import { loginValidation } from "@/settings/Validations";
import axios from "axios";
import { Constants } from "@/constants/Constants";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginValidation,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      try {
        const response = await axios.post(Constants.login_url, values);
        const data = response.data;
        if (data.token) localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } catch (err: any) {
        if (err.response) setError(err.response.data.message || "Invalid credentials");
        else if (err.request) setError("Server not responding. Try again.");
        else setError("Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fieldClass = (touched?: boolean, error?: string) =>
    `w-full bg-white border rounded-xl px-4 py-3.5 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 text-sm font-medium shadow-sm ${
      touched && error
        ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
        : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
    }`;

  return (
    <div className="w-full max-w-[400px]">

      {/* Heading */}
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Welcome back
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          Enter your details to access your dashboard.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-4 text-sm font-medium flex items-center gap-3 mb-6 shadow-sm">
          <FiAlertCircle size={18} className="flex-shrink-0" />
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <FiMail size={18} />
            </div>
            <input
              type="email" name="email" placeholder="name@example.com"
              value={formik.values.email}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              className={`${fieldClass(formik.touched.email, formik.errors.email)} pl-11`}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-rose-500 text-xs font-semibold mt-1">
              {formik.errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-slate-700 text-sm font-semibold">Password</label>
            <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <FiLock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"} name="password" placeholder="••••••••"
              value={formik.values.password}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              className={`${fieldClass(formik.touched.password, formik.errors.password)} pl-11 pr-11`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-rose-500 text-xs font-semibold mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button type="submit" disabled={formik.isSubmitting || !formik.isValid}
          className="w-full bg-indigo-600 text-white rounded-xl py-3.5 font-semibold text-sm shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4 flex justify-center items-center h-[52px]">
          {formik.isSubmitting ? (
            <FiRefreshCw className="animate-spin h-5 w-5" />
          ) : "Sign In"}
        </button>
      </form>

      {/* Register link */}
      <div className="mt-8 text-center text-sm font-medium text-slate-500">
        New to Shiksha?{" "}
        <Link href="/auth/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
          Create an account
        </Link>
      </div>
    </div>
  );
}
