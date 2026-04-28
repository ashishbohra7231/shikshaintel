"use client";

import React, { useEffect, useState } from "react";
import { 
  FiBriefcase, 
  FiUsers, 
  FiCheckCircle, 
  FiXCircle, 
  FiDollarSign, 
  FiSearch,
  FiFilter,
  FiRefreshCw
} from "react-icons/fi";
import ApiDataController from "@/controllers/masters";
import { Constants } from "@/constants/Constants";
import { useTheme } from "@/context/ThemeContext";

interface Library {
  _id: string;
  name: string;
  slug: string;
  totalSeats: number;
  isActive: boolean;
  studentCount: number;
  ownerId: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
}

export default function SuperAdminPage() {
  const { theme, t } = useTheme();
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const fetchLibraries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
      if (!token) return;
      const apiController = new ApiDataController(token);
      const data = await apiController.GetApiWithToken(Constants.get_libraries_url);
      const items = Array.isArray(data) ? data : data?.libraries || data?.data || [];
      setLibraries(items);
    } catch (e) {
      console.error("Failed to fetch libraries", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraries();
  }, []);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const toggleStatus = async (libraryId: string, currentStatus: boolean) => {
    if (togglingId) return;
    setTogglingId(libraryId);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
      if (!token) return;
      const apiController = new ApiDataController(token);
      
      const response = await apiController.PutApiWithToken(`${Constants.add_library_url}/${libraryId}`, {
        isActive: !currentStatus
      });
      
      // Use the server's version of the object if possible
      const updatedLib = response.library || response.data || response;
      
      setLibraries(prev => prev.map(lib => 
        lib._id === libraryId ? { ...lib, ...updatedLib } : lib
      ));
    } catch (e) {
      console.error("Status update failed:", e);
      alert("Failed to update status. Please check your connection.");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredLibraries = libraries.filter(lib => {
    const matchesSearch = lib.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lib.ownerId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || 
                         (filter === "active" && lib.isActive) || 
                         (filter === "inactive" && !lib.isActive);
    return matchesSearch && matchesFilter;
  });

  // Calculate platform metrics
  const calculateBill = (count: number) => {
    const base = 499;
    if (count <= 50) return base;
    return base + (count - 50) * 20;
  };

  const totalRevenue = filteredLibraries.reduce((acc, lib) => acc + calculateBill(lib.studentCount || 0), 0);
  const totalSeats = filteredLibraries.reduce((acc, lib) => acc + (lib.totalSeats || 0), 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FiRefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading Platform Data...</p>
      </div>
    );
  }

  const [isGenerating, setIsGenerating] = useState(false);

  const generateBills = async () => {
    if (!confirm("Are you sure you want to generate bills for the current month for ALL branches? This will create permanent records for history.")) return;
    
    setIsGenerating(true);
    try {
      const token = (localStorage.getItem("token") || localStorage.getItem("app-auth")) ?? undefined;
      const apiController = new ApiDataController(token);
      const res :any = await apiController.PostApiWithToken(Constants.generate_bills_url, {});
      alert(res.message || "Bills generated successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to generate bills.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Control</h1>
          <p className="text-sm text-slate-500 mt-1">Global management for all registered library branches.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={generateBills}
             disabled={isGenerating}
             className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
               isGenerating 
               ? "bg-slate-100 text-slate-400 cursor-wait" 
               : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
             }`}
           >
             {isGenerating ? <FiRefreshCw className="animate-spin" /> : <FiDollarSign />}
             <span>{isGenerating ? "Generating..." : "Generate Monthly Bills"}</span>
           </button>
           <button 
             onClick={fetchLibraries}
             className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
           >
             <FiRefreshCw size={18} />
           </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FiBriefcase size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Branches</p>
              <h3 className="text-2xl font-black text-slate-900">{libraries.length}</h3>
            </div>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FiUsers size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Students</p>
              <h3 className="text-2xl font-black text-slate-900">
                {libraries.reduce((acc, l) => acc + (l.studentCount || 0), 0)}
              </h3>
            </div>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Revenue</p>
              <h3 className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <FiBriefcase size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Capacity</p>
              <h3 className="text-2xl font-black text-slate-900">{totalSeats}</h3>
            </div>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-rose-500 rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search branches or owners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                filter === f 
                ? "bg-slate-900 text-white shadow-md" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* BRANCH TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Branch Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ownership</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Performance</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Platform Bill</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLibraries.map((lib) => (
                <tr key={lib._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lib.name}</span>
                      <span className="text-xs text-slate-400 font-medium">Slug: {lib.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">{lib.ownerId?.name || "Unknown"}</span>
                      <span className="text-xs text-slate-400">{lib.ownerId?.email}</span>
                      {lib.ownerId?.phone && (
                        <span className="text-[10px] font-bold text-indigo-600 mt-0.5">{lib.ownerId.phone}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{lib.studentCount || 0}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Active Students</span>
                      </div>
                      <div className="w-px h-6 bg-slate-100"></div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{lib.totalSeats || 0}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Capacity</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex flex-col items-center px-3 py-1 bg-amber-50 rounded-lg">
                      <span className="text-sm font-black text-amber-700">₹{calculateBill(lib.studentCount || 0).toLocaleString()}</span>
                      <span className="text-[9px] text-amber-600/70 font-bold uppercase tracking-tighter">Current Month</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => toggleStatus(lib._id, lib.isActive)}
                      disabled={togglingId === lib._id}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                        togglingId === lib._id
                        ? "bg-slate-100 text-slate-400 cursor-wait"
                        : lib.isActive 
                          ? "bg-emerald-50 text-emerald-600 hover:bg-rose-50 hover:text-rose-600 group/btn" 
                          : "bg-rose-50 text-rose-600 hover:bg-emerald-50 hover:text-emerald-600 group/btn"
                      }`}
                    >
                      {togglingId === lib._id ? (
                        <>
                          <FiRefreshCw className="animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : lib.isActive ? (
                        <>
                          <FiCheckCircle className="group-hover/btn:hidden" />
                          <FiXCircle className="hidden group-hover/btn:block" />
                          <span className="group-hover/btn:hidden">Active</span>
                          <span className="hidden group-hover/btn:block">Deactivate?</span>
                        </>
                      ) : (
                        <>
                          <FiXCircle className="group-hover/btn:hidden" />
                          <FiCheckCircle className="hidden group-hover/btn:block" />
                          <span className="group-hover/btn:hidden">Inactive</span>
                          <span className="hidden group-hover/btn:block">Activate?</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLibraries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No branches found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
           <p className="text-xs text-slate-500 font-medium">
             Showing {filteredLibraries.length} of {libraries.length} total branches
           </p>
           <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mr-2 text-[10px]">Total Revenue potential:</span>
              <span className="text-sm font-black text-slate-900">₹{totalRevenue.toLocaleString()}</span>
           </div>
        </div>
      </div>

    </div>
  );
}
