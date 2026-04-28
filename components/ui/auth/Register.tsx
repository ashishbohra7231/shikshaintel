"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { 
  FiAlertCircle, 
  FiCheckCircle, 
  FiRefreshCw, 
  FiChevronLeft 
} from "react-icons/fi";
import axios from "axios";
import { Constants } from "@/constants/Constants";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    else setCanResend(true);
    return () => clearTimeout(timer);
  }, [countdown]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Required"),
    otp: Yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", phone: "", password: "", confirmPassword: "", otp: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      try {
        await axios.post(Constants.SIGN_UP, {
          name: values.name, email: values.email,
          phone: values.phone, password: values.password, otp: values.otp,
        });
        setSuccess(true);
        setTimeout(() => router.push("/auth/login"), 2000);
      } catch (err: any) {
        setError(err.response?.data?.message || "Registration failed.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSendOTP = async () => {
    if (!formik.values.email || formik.errors.email) {
      setError("Enter a valid email first.");
      return;
    }
    setIsSendingOtp(true);
    setError("");
    try {
      await axios.post(Constants.SEND_OTP, { email: formik.values.email });
      setOtpSent(true);
      setCanResend(false);
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const fieldClass = (touched?: boolean, error?: string) =>
    `w-full bg-white border rounded-xl px-4 py-3.5 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 text-sm font-medium shadow-sm ${
      touched && error
        ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
        : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
    }`;

  return (
    <div className="w-full max-w-[420px]">
      
      {/* Heading */}
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Create an account
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          Set up your library in under 5 minutes.
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {[{ n: 1, label: "Your Info" }, { n: 2, label: "Security" }].map((s, i) => (
          <React.Fragment key={s.n}>
            <div className={`flex items-center gap-2 ${step >= s.n ? "text-indigo-600" : "text-slate-400"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${step > s.n ? "bg-indigo-600 border-indigo-600 text-white" : step === s.n ? "border-indigo-400 text-indigo-600 bg-indigo-50" : "border-slate-200 text-slate-400"}`}>
                {step > s.n ? "✓" : s.n}
              </div>
              <span className={`text-xs font-bold ${step >= s.n ? "text-indigo-600" : "text-slate-400"}`}>{s.label}</span>
            </div>
            {i < 1 && <div className={`flex-1 h-0.5 mx-2 rounded transition-all ${step > 1 ? "bg-indigo-300" : "bg-slate-200"}`}></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-4 text-sm font-medium flex items-center gap-3 mb-6 shadow-sm">
          <FiAlertCircle size={18} className="flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 text-sm font-medium flex items-center gap-3 mb-6 shadow-sm">
          <FiCheckCircle size={18} className="flex-shrink-0" />
          Account created! Redirecting to login...
        </div>
      )}

      <form className="space-y-4" onSubmit={formik.handleSubmit}>

        {/* STEP 1: Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 text-sm font-semibold">Full Name</label>
              <input type="text" name="name" placeholder="Rajesh Sharma"
                value={formik.values.name} onChange={formik.handleChange}
                className={fieldClass(formik.touched.name, formik.errors.name)} />
              {formik.touched.name && formik.errors.name && <p className="text-rose-500 text-xs font-semibold mt-1">{formik.errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 text-sm font-semibold">Email Address</label>
              <div className="flex gap-2">
                <input type="email" name="email" placeholder="email@example.com"
                  value={formik.values.email} onChange={formik.handleChange} disabled={otpSent}
                  className={`flex-1 bg-white border rounded-xl px-4 py-3.5 text-slate-900 outline-none transition-all text-sm font-medium shadow-sm border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 placeholder:text-slate-400 ${otpSent ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}`} />
                <button type="button" onClick={handleSendOTP}
                  disabled={isSendingOtp || !canResend || !formik.values.email || !!formik.errors.email}
                  className="flex-shrink-0 bg-slate-900 text-white rounded-xl px-5 text-sm font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 shadow-sm whitespace-nowrap">
                  {isSendingOtp ? "Sending..." : otpSent ? (canResend ? "Resend" : `${countdown}s`) : "Send OTP"}
                </button>
              </div>
              {formik.touched.email && formik.errors.email && <p className="text-rose-500 text-xs font-semibold mt-1">{formik.errors.email}</p>}
            </div>

            {otpSent && (
              <div className="flex flex-col gap-1.5 animate-in fade-in duration-300">
                <label className="text-indigo-600 text-sm font-semibold">
                  OTP Verification Code
                  <span className="ml-2 text-indigo-400 font-medium text-xs hidden sm:inline">— sent to email</span>
                </label>
                <input type="text" name="otp" maxLength={6} placeholder="0 0 0 0 0 0"
                  value={formik.values.otp}
                  onChange={(e) => formik.setFieldValue("otp", e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-indigo-50/50 border border-indigo-200 rounded-xl px-4 py-3.5 text-indigo-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 tracking-[1em] sm:tracking-[1.5em] text-center font-bold text-2xl placeholder:text-indigo-200 shadow-sm" />
                {formik.touched.otp && formik.errors.otp && <p className="text-rose-500 text-xs font-semibold mt-1">{formik.errors.otp}</p>}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 text-sm font-semibold">Phone Number</label>
              <input type="text" name="phone" placeholder="+91 99999 88888"
                value={formik.values.phone} onChange={formik.handleChange}
                className={fieldClass(formik.touched.phone, formik.errors.phone)} />
              {formik.touched.phone && formik.errors.phone && <p className="text-rose-500 text-xs font-semibold mt-1">{formik.errors.phone}</p>}
            </div>

            <button type="button"
              onClick={() => {
                formik.setTouched({ name: true, email: true, phone: true, otp: true });
                if (formik.values.name && formik.values.email && formik.values.phone && otpSent && formik.values.otp.length === 6 && !formik.errors.name && !formik.errors.email && !formik.errors.phone && !formik.errors.otp) setStep(2);
              }}
              className="w-full bg-slate-900 text-white rounded-xl py-3.5 font-semibold text-sm hover:bg-slate-800 transition-all active:scale-[0.98] mt-2 shadow-sm">
              Continue to Security
            </button>
          </div>
        )}

        {/* STEP 2: Security */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold mb-2">
              <FiChevronLeft size={16} /> Back
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                <label className="text-slate-700 text-sm font-semibold">Password</label>
                <input type="password" name="password" placeholder="••••••••"
                  value={formik.values.password} onChange={formik.handleChange}
                  className={fieldClass(formik.touched.password, formik.errors.password)} />
                {formik.touched.password && formik.errors.password && <p className="text-rose-500 text-xs font-semibold mt-1">{formik.errors.password}</p>}
              </div>
              <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                <label className="text-slate-700 text-sm font-semibold">Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="••••••••"
                  value={formik.values.confirmPassword} onChange={formik.handleChange}
                  className={fieldClass(formik.touched.confirmPassword, formik.errors.confirmPassword)} />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-rose-500 text-xs font-semibold mt-1">{formik.errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Password strength */}
            {formik.values.password && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => {
                    const strength = formik.values.password.length >= i * 2 ? true : false;
                    const colors = ["bg-rose-400", "bg-amber-400", "bg-emerald-400", "bg-indigo-500"];
                    return <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${strength ? colors[Math.min(i - 1, colors.length - 1)] : "bg-slate-100"}`}></div>;
                  })}
                </div>
                <p className="text-slate-500 text-xs font-medium">
                  {formik.values.password.length < 6 ? "Too short" : formik.values.password.length < 8 ? "Weak" : formik.values.password.length < 10 ? "Good" : "Strong ✓"}
                </p>
              </div>
            )}

            <button type="submit" disabled={formik.isSubmitting || !formik.isValid}
              className="w-full bg-indigo-600 text-white rounded-xl py-3.5 font-semibold text-sm shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4 flex items-center justify-center h-[52px]">
              {formik.isSubmitting ? (
                <FiRefreshCw className="animate-spin h-5 w-5" />
              ) : "Create Account"}
            </button>
          </div>
        )}
      </form>

      {/* Footer */}
      {step === 1 && (
        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
