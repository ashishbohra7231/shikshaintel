"use client";

import React, { useEffect, useState } from "react";
import ApiDataController from "@/controllers/masters";
import { Constants } from "@/constants/Constants";
import { useRouter } from "next/navigation";
import { FiCreditCard, FiUsers, FiInfo, FiCheckCircle, FiArrowRight, FiClock } from "react-icons/fi";
import DashboardSkeleton from "@/components/ui/dashboard/DashboardSkeleton";

interface LibraryItem {
  id?: string;
  _id?: string;
  name: string;
  studentCount: number;
}

export default function BillingPage() {
  const [libraries, setLibraries] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [billHistory, setBillHistory] = useState<any[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  useEffect(() => {
    async function fetchLibraries() {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
        if (!token) {
          router.push("/");
          return;
        }
        const apiController = new ApiDataController(token);
        const data = await apiController.GetApiWithToken(Constants.get_libraries_url);
        const items = Array.isArray(data) ? data : data?.libraries || data?.data || [];
        setLibraries(items);

        // Fetch History
        try {
          const historyData = await apiController.GetApiWithToken(Constants.get_billing_history_url);
          setBillHistory(Array.isArray(historyData) ? historyData : []);
        } catch (hErr) {
          console.error("Failed to fetch history", hErr);
        } finally {
          setFetchingHistory(false);
        }
      } catch (error) {
        console.error("Failed to fetch libraries", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLibraries();
  }, [router]);

  // Pricing Constants
  const BASE_FEE = 499;
  const STUDENT_LIMIT = 50;
  const EXTRA_STUDENT_FEE = 20;

  const calculateBranchBill = (count: number) => {
    const extraStudents = Math.max(0, count - STUDENT_LIMIT);
    return BASE_FEE + (extraStudents * EXTRA_STUDENT_FEE);
  };

  const grandTotal = libraries.reduce((acc, lib) => acc + calculateBranchBill(lib.studentCount || 0), 0);
  
  if (loading) return <DashboardSkeleton />;

  return (
    <div className="w-full mx-auto pb-12 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0">
            <FiCreditCard className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Branch Billing
            </h1>
            <p className="text-sm text-slate-500 mt-1">Itemized monthly bills for each of your library branches.</p>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 flex flex-col items-end shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Platform Due</span>
          <span className="text-2xl font-black text-white">₹{grandTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BILLING LIST */}
        <div className="lg:col-span-2 space-y-6">
          {libraries.map((lib, idx) => {
            const bill = calculateBranchBill(lib.studentCount || 0);
            const extraCount = Math.max(0, (lib.studentCount || 0) - STUDENT_LIMIT);
            const extraCharge = extraCount * EXTRA_STUDENT_FEE;

            return (
              <div key={lib.id || lib._id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:border-indigo-300 transition-all">
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${['bg-indigo-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-blue-500'][idx % 4]}`}>
                      {lib.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{lib.name}</h2>
                  </div>
                  <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Monthly Statement
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Base Membership (50 Students)</span>
                        <span className="font-bold text-slate-900">₹{BASE_FEE}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Additional Students ({extraCount} × ₹{EXTRA_STUDENT_FEE})</span>
                        <span className="font-bold text-slate-900">₹{extraCharge}</span>
                      </div>
                      <div className="h-px bg-slate-100"></div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-900 font-black">Branch Total</span>
                        <span className="text-xl font-black text-indigo-600">₹{bill}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 flex flex-col justify-center items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm mb-3">
                        <FiUsers size={18} />
                      </div>
                      <p className="text-2xl font-black text-slate-900">{lib.studentCount || 0}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Students</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest group/btn">
                      View Usage Details <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {libraries.length === 0 && (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
              <p className="text-slate-400 font-medium">No library branches found to generate bills.</p>
            </div>
          )}
        </div>

        {/* BILLING HISTORY SECTION */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Billing History</h2>
              <FiClock className="text-slate-400" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100">
                    <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Month/Year</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Branch</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Students</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Amount</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fetchingHistory ? (
                    <tr>
                       <td colSpan={5} className="px-8 py-10 text-center text-slate-400 text-sm">Loading history...</td>
                    </tr>
                  ) : billHistory.length === 0 ? (
                    <tr>
                       <td colSpan={5} className="px-8 py-10 text-center text-slate-400 text-sm italic">No past bills found.</td>
                    </tr>
                  ) : (
                    billHistory.map((bill, bIdx) => (
                      <tr key={bill._id || bIdx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4">
                           <span className="font-bold text-slate-900">{new Date(0, bill.month - 1).toLocaleString('default', { month: 'long' })}</span>
                           <span className="text-slate-400 ml-1 font-medium">{bill.year}</span>
                        </td>
                        <td className="px-8 py-4">
                           <span className="text-sm font-semibold text-slate-700">{bill.libraryId?.name || "Deleted Branch"}</span>
                        </td>
                        <td className="px-8 py-4 text-center">
                           <span className="text-sm font-bold text-slate-600">{bill.studentCount}</span>
                        </td>
                        <td className="px-8 py-4 text-center">
                           <span className="text-sm font-black text-slate-900">₹{bill.totalAmount.toLocaleString()}</span>
                        </td>
                        <td className="px-8 py-4 text-right">
                           <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                             bill.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                           }`}>
                             {bill.status}
                           </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SIDEBAR INFO */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <FiCheckCircle size={120} />
            </div>
            
            <h3 className="text-xl font-bold mb-4 relative z-10">Why Shiksha Intelligence?</h3>
            <ul className="space-y-4 relative z-10">
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-white/20 p-1 rounded-full"><FiCheckCircle size={14} /></div>
                <p className="text-sm text-indigo-50">Pay only for what you use with fair-tier pricing.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-white/20 p-1 rounded-full"><FiCheckCircle size={14} /></div>
                <p className="text-sm text-indigo-50">Manage unlimited branches under one subscription.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-white/20 p-1 rounded-full"><FiCheckCircle size={14} /></div>
                <p className="text-sm text-indigo-50">Automated WhatsApp & Email notifications included.</p>
              </li>
            </ul>
            
            <button className="w-full mt-8 bg-white text-indigo-600 font-bold py-4 rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group/btn shadow-lg">
              <span>Pay Now</span>
              <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
            <div className="flex items-center gap-3 text-amber-700 mb-3">
              <FiInfo size={20} />
              <h4 className="font-bold">Plan Information</h4>
            </div>
            <p className="text-xs text-amber-600 leading-relaxed">
              Your billing cycle starts on the 1st of every month. The bill is calculated based on the maximum active students recorded during the cycle.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
