"use client";

import ApiDataController from "@/controllers/masters";
import React, { useEffect, useState, useMemo } from "react";
import { FiDollarSign, FiChevronRight } from "react-icons/fi";
import { Constants } from "@/constants/Constants";
import Link from "next/link";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell 
} from 'recharts';
import { FiX, FiUsers, FiInfo, FiRefreshCw } from "react-icons/fi";
import RevenueSkeleton from "@/components/ui/dashboard/RevenueSkeleton";

interface LibraryItem {
  id?: string;
  _id?: string;
  name: string;
  address: string;
  totalSeats: number;
  studentCount: number;
  revenue?: number;
  slug?: string;
}

export default function RevenuePage() {
  const [libraries, setLibraries] = useState<LibraryItem[]>([]);
  const [allStats, setAllStats] = useState<any[]>([]);
  const [selectedLibId, setSelectedLibId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail Modal States
  const [selectedLibForDetail, setSelectedLibForDetail] = useState<LibraryItem | null>(null);
  const [detailedStudents, setDetailedStudents] = useState<any[]>([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleViewDetail = async (lib: LibraryItem) => {
    setSelectedLibForDetail(lib);
    setShowDetailModal(true);
    setIsDetailLoading(true);
    setDetailedStudents([]);

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
      if (!token) return;
      const apiController = new ApiDataController(token);
      
      const slug = lib.slug || lib.id || lib._id;
      if (!slug) throw new Error("Missing library identifier");

      const data = await apiController.GetApiWithToken(`${Constants.get_libraries_by_slug_url}${slug}`);
      const studentData = data?.students || data?.library?.students || [];
      
      // Sort by finalPrice descending to show highest contributors first
      const sortedStudents = Array.isArray(studentData) 
        ? [...studentData].sort((a: any, b: any) => (b.finalPrice || 0) - (a.finalPrice || 0))
        : [];
        
      setDetailedStudents(sortedStudents);
    } catch (e) {
      console.error("Failed to fetch library detail for revenue breakdown:", e);
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
        if (!token) {
          window.location.href = "/";
          return;
        }
        const apiController = new ApiDataController(token);
        
        // 1. Fetch Libraries
        const data = await apiController.GetApiWithToken(Constants.get_libraries_url);
        const items = Array.isArray(data) ? data : data?.libraries || data?.data || [];

        // 2. Fetch Stats for each library and aggregate
        const allStatsAccumulator: any[] = [];
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const enrichedItems = await Promise.all(items.map(async (lib: any) => {
          try {
            const libId = lib._id || lib.id;
            const statsRes = await apiController.GetApiWithToken(`${Constants.monthly_stats_url}?libraryId=${libId}`);
            
            let revenue = 0;
            if (statsRes.stats && Array.isArray(statsRes.stats)) {
              // Add to global stats for charts
              statsRes.stats.forEach((s: any) => {
                allStatsAccumulator.push({ ...s, libraryId: libId });
              });

              const currentStat = statsRes.stats.find((s: any) => s.month === currentMonth && s.year === currentYear);
              if (currentStat) {
                revenue = currentStat.totalRevenue || 0;
              }
            }
            
            return {
              ...lib,
              revenue: revenue
            };
          } catch (e) {
            return { ...lib, revenue: 0 };
          }
        }));

        setAllStats(allStatsAccumulator);
        enrichedItems.sort((a: any, b: any) => (b.revenue || 0) - (a.revenue || 0));
        setLibraries(enrichedItems);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Unable to load revenue data right now.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const aggregatedStats: { [key: string]: { month: number; year: number; revenue: number; students: number } } = {};

    const filteredStats = selectedLibId === "all" 
      ? allStats 
      : allStats.filter(s => {
          const statLibId = s.libraryId || s.libId || s.library;
          // Handle both string and object (if populated)
          const actualStatId = typeof statLibId === 'object' ? (statLibId._id || statLibId.id) : statLibId;
          return String(actualStatId) === String(selectedLibId);
        });

    filteredStats.forEach((s: any) => {
      const key = `${s.year}-${s.month}`;
      if (!aggregatedStats[key]) {
        aggregatedStats[key] = { month: s.month, year: s.year, revenue: 0, students: 0 };
      }
      aggregatedStats[key].revenue += s.totalRevenue || 0;
      aggregatedStats[key].students += s.studentsAdded || 0;
    });

    return Object.values(aggregatedStats)
      .sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month))
      .map(s => ({
        name: `${monthNames[s.month - 1]} ${s.year}`,
        revenue: s.revenue,
        students: s.students
      }))
      .slice(-6); // Last 6 months
  }, [allStats, selectedLibId]);

  const totals = useMemo(() => {
    return libraries.reduce((acc, lib) => ({
      students: acc.students + (lib.studentCount || 0),
      revenue: acc.revenue + (lib.revenue || 0)
    }), { students: 0, revenue: 0 });
  }, [libraries]);

  const maxRevenue = useMemo(() => {
    return Math.max(...libraries.map(lib => lib.revenue || 0), 1); // Avoid division by zero
  }, [libraries]);

  if (loading) {
    return <RevenueSkeleton />;
  }

  return (
    <div className="w-full mx-auto pb-10 max-w-[1400px]">

      {/* 🟢 GLOBAL REVENUE SUMMARY */}
      <section className="mb-10">
        <div className=" bg-violet-500/10 p-8 rounded-xl rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FiDollarSign size={20} />
                </div>
                <h1 className="text-slate-500 font-bold uppercase tracking-wider text-xs">Total Network Revenue</h1>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">₹{totals.revenue.toLocaleString()}</span>
                <span className="text-slate-400 font-semibold text-sm">/ month</span>
              </div>
            </div>

            <div className="flex gap-8 bg-green-50 p-6 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Active Students</p>
                <p className="text-2xl font-bold text-slate-900">{totals.students}</p>
              </div>
              <div className="w-px bg-slate-200"></div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Avg per Student</p>
                <p className="text-2xl font-bold text-slate-900">₹{totals.students > 0 ? Math.round(totals.revenue / totals.students).toLocaleString() : 0}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 ANALYTICS CHARTS */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Performance Analytics</h2>
            <p className="text-xs text-slate-500 mt-1">Growth and revenue trends across your network.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">Filter By:</span>
            <select 
              value={selectedLibId}
              onChange={(e) => setSelectedLibId(e.target.value)}
              className="bg-slate-50 border-none text-sm font-bold text-slate-700 py-2 pl-3 pr-8 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              <option value="all">All Branches</option>
              {libraries.map(lib => (
                <option key={lib._id || lib.id} value={lib._id || lib.id}>
                  {lib.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Collection Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Monthly Collection</h3>
              <p className="text-xs text-slate-500">Revenue trends for the last 6 months</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FiDollarSign size={18} />
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="w-full h-full bg-slate-50 animate-pulse rounded-xl"></div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    tickFormatter={(value) => `₹${value >= 1000 ? (value/1000) + 'k' : value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm italic">
                No data available for charts
              </div>
            )}
          </div>
        </div>

        {/* Monthly Students Added Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Student Growth</h3>
              <p className="text-xs text-slate-500">New enrollments per month</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FiChevronRight size={18} className="rotate-90" />
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="w-full h-full bg-slate-50 animate-pulse rounded-xl"></div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [value, 'Students Added']}
                  />
                  <Bar 
                    dataKey="students" 
                    fill="#6366f1" 
                    radius={[6, 6, 0, 0]} 
                    barSize={40}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#4f46e5' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm italic">
                No data available for charts
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

      {/* 🏢 BRANCH REVENUE BREAKDOWN */}
      <section>
        <div className="flex justify-between items-end mb-6 pl-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Branch Breakdown</h2>
            <p className="text-xs text-slate-500 mt-1">Financial performance across all locations.</p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border-2 border-dashed border-slate-100 bg-white/50 p-12 text-center animate-pulse">
            <p className="text-slate-300 font-bold uppercase tracking-[0.2em] text-xs">Processing Financial Data...</p>
          </div>
        ) : error ? (
          <div className="rounded-[2rem] bg-rose-50 p-8 text-center text-rose-600 font-bold border border-rose-100 shadow-sm text-sm">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap table-auto">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[35%]">Branch Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[15%]">Students</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Network Share</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[20%]">Monthly Revenue</th>
                    <th className="px-6 py-4 w-[5%]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {libraries.map((lib, index) => {
                    const slug = lib.id || lib._id || lib.name?.toLowerCase().replace(/\s+/g, "-");
                    const initial = lib.name.charAt(0).toUpperCase();
                    const revenue = lib.revenue || 0;
                    const contributionPercent = totals.revenue > 0 ? (revenue / totals.revenue) * 100 : 0;
                    const fillPercent = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;

                    // Top 3 branches get special styling
                    return (
                      <tr key={lib.id || lib._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/${slug}`} className="flex items-center gap-4 group">
                            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {initial}
                            </div>
                            <div className="truncate">
                              <p className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                                {lib.name}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">{lib?.address?.split(',')[0] || "Branch Area"}</p>
                            </div>
                          </Link>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-bold text-slate-700">{lib.studentCount || 0}</span>
                          <span className="block text-[10px] text-slate-400 font-medium">Active</span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-500">{contributionPercent.toFixed(1)}% share</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-indigo-600 transition-all duration-1000"
                                style={{ width: `${fillPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-bold text-slate-900">
                            ₹{revenue.toLocaleString()}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => handleViewDetail(lib)}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 shadow-sm"
                            >
                              View Detail
                            </button>
                            <Link href={`/dashboard/${slug}`} className="text-slate-400 hover:text-indigo-600 transition-colors">
                              <FiChevronRight size={18} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {libraries.length === 0 && !loading && (
                <div className="p-12 text-center flex flex-col items-center gap-4">
                  <p className="text-lg font-bold text-slate-900 leading-tight">No Branches Found</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-1">Start by adding your first library branch to track revenue.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 🧾 REVENUE DETAIL MODAL */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <FiDollarSign size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedLibForDetail?.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Detailed Fee Breakdown (Active Cycle)</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isDetailLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <FiRefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Aggregating Student Fees...</p>
                </div>
              ) : detailedStudents.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                        <FiUsers size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Participating Students</span>
                    </div>
                    <span className="text-lg font-black text-slate-900">{detailedStudents.length}</span>
                  </div>

                  <div className="overflow-hidden border border-slate-100 rounded-xl">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <tr>
                          <th className="px-4 py-3">Student Name</th>
                          <th className="px-4 py-3">Plan / Shift</th>
                          <th className="px-4 py-3 text-right">Fee Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {detailedStudents.map((student, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <p className="text-sm font-bold text-slate-800">{student.name}</p>
                              <p className="text-[10px] text-slate-400">{student.phone}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs font-semibold text-slate-600 capitalize">{student.planType}</span>
                              <span className="text-[10px] text-slate-400 ml-2">({student.shift})</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-sm font-black text-indigo-600">₹{student.finalPrice?.toLocaleString()}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiInfo size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No active student fees found for this branch.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!isDetailLoading && detailedStudents.length > 0 && (
              <div className="p-6 bg-slate-900 rounded-b-2xl flex items-center justify-between shadow-2xl shadow-slate-900/20">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Total Revenue Summation</span>
                  <p className="text-xs text-slate-400 mt-1">Sum of all individual student fees</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white tracking-tight">
                    ₹{detailedStudents.reduce((acc, s) => acc + (s.finalPrice || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
