"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { 
  FiBookOpen, 
  FiSun, 
  FiMoon, 
  FiClock, 
  FiRefreshCw, 
  FiArrowRight 
} from "react-icons/fi";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addLibraryValidation } from "@/settings/Validations";
import InputField from "@/components/ui/dashboard/InputField";
import MessageBox from "@/components/models/MessageBox";
import ApiDataController from "@/controllers/masters";
import { Constants } from "@/constants/Constants";

// Validation Schema
const validationSchema = addLibraryValidation;

interface FormValues {
  name: string;
  phone: string;
  state: string;
  city: string;
  locality: string;
  totalSeats: number;
  shifts: {
    morning: { start: string; end: string };
    evening: { start: string; end: string };
    fullDay: { start: string; end: string };
  };
  pricing: {
    half_day: { monthly: number; quarterly: number; yearly: number };
    full_day: { monthly: number; quarterly: number; yearly: number };
  };
}

const inputClassName = "w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100";

export default function AddLibraryPage() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: any
  ) => {
    const token = localStorage.getItem('token') || localStorage.getItem('app-auth');
    if (!token) {
      router.push("/");
      setSubmitting(false);
      return;
    }

    try {
      const apiController = new ApiDataController(token);
      
      // Clean up the data before sending (ensure numbers are numbers)
      const payload = {
        name: values.name,
        phone: values.phone,
        state: values.state,
        city: values.city,
        locality: values.locality,
        totalSeats: Number(values.totalSeats),
        shifts: values.shifts,
        pricing: {
          half_day: {
            monthly: Number(values.pricing.half_day.monthly),
            quarterly: Number(values.pricing.half_day.quarterly),
            yearly: Number(values.pricing.half_day.yearly),
          },
          full_day: {
            monthly: Number(values.pricing.full_day.monthly),
            quarterly: Number(values.pricing.full_day.quarterly),
            yearly: Number(values.pricing.full_day.yearly),
          }
        }
      };

      await apiController.PostApiWithToken(Constants.add_library_url, payload);
      setSubmitSuccess(true);
      resetForm();
      setTimeout(() => {
        setSubmitSuccess(false);
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to add library. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues: FormValues = {
    name: "",
    phone: "",
    state: "",
    city: "",
    locality: "",
    totalSeats: 0,
    shifts: {
      morning: { start: "06:00", end: "14:00" },
      evening: { start: "14:00", end: "22:00" },
      fullDay: { start: "06:00", end: "22:00" },
    },
    pricing: {
      half_day: { monthly: 0, quarterly: 0, yearly: 0 },
      full_day: { monthly: 0, quarterly: 0, yearly: 0 },
    },
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-violet-500/10 p-8 rounded-xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Branch</h1>
          <p className="text-sm text-slate-500 mt-1">Add a new library location to your network.</p>
        </div>
        <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
          Back to Dashboard
        </Link>
      </div>

      <MessageBox
        open={submitSuccess}
        title="Configuration Successful"
        description="Your new branch has been established. Redirecting to network dashboard."
      />

      {/* 🛠️ CONFIGURATION CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors, values, setFieldValue }) => (
            <Form className="space-y-12">
              
              {/* SECTION 1: IDENTITY */}
              <section>
                <div className="flex items-center gap-3 mb-8 pb-3 border-b border-slate-100">
                   <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">1</div>
                   <h2 className="text-lg font-bold text-slate-900">Branch Identity</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Branch Name"
                    name="name"
                    placeholder="e.g. South Campus Branch"
                    errors={errors.name}
                    touched={touched.name}
                  />
                  <InputField
                    label="Operational Hotline"
                    name="phone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    errors={errors.phone}
                    touched={touched.phone}
                  />
                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                    <InputField
                      label="State"
                      name="state"
                      placeholder="e.g. Rajasthan"
                      errors={errors.state}
                      touched={touched.state}
                    />
                    <InputField
                      label="City"
                      name="city"
                      placeholder="e.g. Jaipur"
                      errors={errors.city}
                      touched={touched.city}
                    />
                    <InputField
                      label="Locality"
                      name="locality"
                      placeholder="e.g. Malviya Nagar"
                      errors={errors.locality}
                      touched={touched.locality}
                    />
                  </div>
                  
                  <div className="md:col-span-2 pt-6">

                       <InputField
                        label="Seat Capacity"
                        name="totalSeats"
                        type="number"
                        placeholder="0"
                        errors={errors.totalSeats}
                        touched={touched.totalSeats}
                      />


                  </div>
                </div>
              </section>

              {/* SECTION 2: OPERATIONS */}
              <section>
                <div className="flex items-center gap-3 mb-8 pb-3 border-b border-slate-100">
                   <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">2</div>
                   <h2 className="text-lg font-bold text-slate-900">Shift Timings</h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {[
                    { id: 'morning', label: 'Morning Slot', icon: FiSun, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { id: 'evening', label: 'Evening Slot', icon: FiMoon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { id: 'fullDay', label: 'Full Day', icon: FiClock, color: 'text-rose-600', bg: 'bg-rose-50' }
                  ].map((shift) => (
                    <div key={shift.id} className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                       <div className="flex items-center gap-3 mb-6">
                          <div className={`w-10 h-10 rounded-lg ${shift.bg} flex items-center justify-center ${shift.color}`}>
                             <shift.icon size={20} />
                          </div>
                          <p className="text-sm font-bold text-slate-900">{shift.label}</p>
                       </div>
                       <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Starts At</label>
                            <Field as="input" type="time" name={`shifts.${shift.id}.start`} className={inputClassName} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Ends At</label>
                            <Field as="input" type="time" name={`shifts.${shift.id}.end`} className={inputClassName} />
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 3: REVENUE */}
              <section>
                <div className="flex items-center gap-3 mb-8 pb-3 border-b border-slate-100">
                   <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">3</div>
                   <h2 className="text-lg font-bold text-slate-900">Pricing Models</h2>
                </div>

                <div className="space-y-6">
                  {['half_day', 'full_day'].map((model) => (
                    <div key={model} className="p-8 rounded-xl bg-slate-50 border border-slate-200">
                       <div className="flex items-center gap-2 mb-6">
                          <div className={`w-2 h-2 rounded-full ${model === 'half_day' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                          <h3 className="text-sm font-bold text-slate-900 uppercase">{model.replace('_', ' ')} Plan</h3>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          {['monthly', 'quarterly', 'yearly'].map((period) => (
                            <div key={period} className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-600 ml-1 capitalize">{period} Rate</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-sm font-bold">₹</span>
                                <Field as="input" type="number" name={`pricing.${model}.${period}`} className={`${inputClassName} pl-8 font-bold text-sm`} />
                              </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="pt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="flex-1 h-12 rounded-xl border border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] h-12 rounded-xl bg-slate-950 text-white text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      Creating Branch...
                    </>
                  ) : (
                    <>
                      Save and Launch Branch
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
