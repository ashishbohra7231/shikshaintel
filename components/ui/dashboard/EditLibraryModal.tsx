"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { 
  FiX, 
  FiSun, 
  FiMoon, 
  FiClock, 
  FiRefreshCw, 
  FiSave 
} from "react-icons/fi";
import { addLibraryValidation } from "@/settings/Validations";
import InputField from "@/components/ui/dashboard/InputField";
import ApiDataController from "@/controllers/masters";
import { Constants } from "@/constants/Constants";

interface EditLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  library: any;
  onUpdate: () => void;
}

const inputClassName = "w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100";

export default function EditLibraryModal({ isOpen, onClose, library, onUpdate }: EditLibraryModalProps) {
  if (!isOpen || !library) return null;

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    const token = localStorage.getItem('token') || localStorage.getItem('app-auth');
    if (!token) return;

    try {
      const apiController = new ApiDataController(token);
      
      // The backend updateLibrary uses Object.assign(library, req.body)
      // So we can send the JSON directly
      const updateData = {
        name: values.name,
        phone: values.phone,
        state: values.state,
        city: values.city,
        locality: values.locality,
        totalSeats: values.totalSeats,
        shifts: values.shifts,
        pricing: values.pricing
      };

      await apiController.PutApiWithToken(`${Constants.add_library_url}/${library._id || library.id}`, updateData);
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating library:', error);
      alert('Failed to update library. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    name: library.name || "",
    phone: library.phone || "",
    state: library.state || "",
    city: library.city || "",
    locality: library.locality || "",
    totalSeats: library.totalSeats || 0,
    shifts: library.shifts || {
      morning: { start: "06:00", end: "14:00" },
      evening: { start: "14:00", end: "22:00" },
      fullDay: { start: "06:00", end: "22:00" },
    },
    pricing: library.pricing || {
      half_day: { monthly: 0, quarterly: 0, yearly: 0 },
      full_day: { monthly: 0, quarterly: 0, yearly: 0 },
    },
    image: null,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Branch Details</h2>
            <p className="text-xs text-slate-500 mt-0.5">Modify configuration for {library.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <FiX size={24} className="text-slate-400" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={addLibraryValidation}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors, values }) => (
              <Form className="space-y-10">
                
                {/* IDENTITY */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                       <FiRefreshCw size={14} />
                    </div>
                    <h3 className="font-bold text-slate-900">Branch Identity</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Branch Name" name="name" errors={errors.name} touched={touched.name} />
                    <InputField label="Phone" name="phone" errors={errors.phone} touched={touched.phone} />
                    <div className="md:col-span-2 grid grid-cols-3 gap-5">
                      <InputField label="State" name="state" errors={errors.state} touched={touched.state} />
                      <InputField label="City" name="city" errors={errors.city} touched={touched.city} />
                      <InputField label="Locality" name="locality" errors={errors.locality} touched={touched.locality} />
                    </div>
                    <InputField label="Total Seats" name="totalSeats" type="number" errors={errors.totalSeats} touched={touched.totalSeats} />
                  </div>
                </section>

                {/* SHIFTS */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                       <FiClock size={14} />
                    </div>
                    <h3 className="font-bold text-slate-900">Shift Timings</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      { id: 'morning', label: 'Morning', icon: FiSun, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { id: 'evening', label: 'Evening', icon: FiMoon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                      { id: 'fullDay', label: 'Full Day', icon: FiClock, color: 'text-rose-600', bg: 'bg-rose-50' }
                    ].map((shift) => (
                      <div key={shift.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-4">
                          <shift.icon size={14} className={shift.color} />
                          <span className="text-xs font-bold text-slate-700">{shift.label}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 ml-1">Start</span>
                            <Field as="input" type="time" name={`shifts.${shift.id}.start`} className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs font-bold" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 ml-1">End</span>
                            <Field as="input" type="time" name={`shifts.${shift.id}.end`} className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs font-bold" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* PRICING */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                       <FiRefreshCw size={14} />
                    </div>
                    <h3 className="font-bold text-slate-900">Pricing Models</h3>
                  </div>
                  <div className="space-y-4">
                    {['half_day', 'full_day'].map((model) => (
                      <div key={model} className="p-5 rounded-2xl border border-slate-100">
                        <p className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">{model.replace('_', ' ')} Plan</p>
                        <div className="grid grid-cols-3 gap-5">
                          {['monthly', 'quarterly', 'yearly'].map((period) => (
                            <div key={period} className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-500 ml-1 capitalize">{period}</span>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                                <Field as="input" type="number" name={`pricing.${model}.${period}`} className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-200 text-sm font-bold" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ACTIONS */}
                <div className="pt-6 flex gap-4 sticky bottom-0 bg-white pb-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-12 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] h-12 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
                    <span>Update Configuration</span>
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
