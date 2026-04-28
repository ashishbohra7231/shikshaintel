"use client";

import ApiDataController from "@/controllers/masters";
import React, { useEffect, useState } from "react";
import { Constants } from "@/constants/Constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiHome, FiPlus, FiEdit2 } from "react-icons/fi";
import DashboardSkeleton from "@/components/ui/dashboard/DashboardSkeleton";
import EditLibraryModal from "@/components/ui/dashboard/EditLibraryModal";
import { useTheme } from "@/context/ThemeContext";

interface LibraryItem {
  id?: string;
  _id?: string;
  name: string;
  address: string;
  slug: string;
  detail: string;
  totalSeats: number;
  studentCount: number;
  revenue?: number;
  image?: string;
  isActive?: boolean;
}

export default function Dashboard() {
  const { t } = useTheme();
  const [libraries, setLibraries] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLibrary, setEditingLibrary] = useState<LibraryItem | null>(null);
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchLibraries = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
      if (!token) {
        router.push("/");
        return;
      }

      // Decode token for role
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (e) {}

      const apiController = new ApiDataController(token);
      const data = await apiController.GetApiWithToken(Constants.get_libraries_url);
      const items = Array.isArray(data) ? data : data?.libraries || data?.data || [];

      setLibraries(items);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to load libraries right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraries();
  }, [router]);

  const handleEditClick = (lib: LibraryItem) => {
    setEditingLibrary(lib);
    setIsEditModalOpen(true);
  };

  const totalSeatsGlobal = libraries.reduce((acc, lib) => acc + (lib.totalSeats || 0), 0);
  const totalStudentsGlobal = libraries.reduce((acc, lib) => acc + (lib.studentCount || 0), 0);
  const avgOccupancy = totalSeatsGlobal > 0 ? Math.round((totalStudentsGlobal / totalSeatsGlobal) * 100) : 0;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="w-full mx-auto pb-12 space-y-8">
      
      {/* HEADER */}
      <div className={`${t.bgLight} border ${t.borderPrimary} rounded-2xl px-5 py-5 sm:px-7 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center shadow-md ${t.shadow} flex-shrink-0`}>
            <FiHome className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Library Network
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage and monitor all your branches in one seamless view.</p>
          </div>
        </div>
        
        <Link href="/dashboard/add_library" className={`group inline-flex h-10 sm:h-11 items-center justify-center gap-2 px-5 bg-gradient-to-r ${t.gradient} text-white rounded-xl text-sm font-semibold transition-all active:scale-95 hover:opacity-90 shadow-md ${t.shadow} w-full sm:w-auto`}>
          <FiPlus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>Add New Branch</span>
        </Link>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className={`${t.bgLight} p-3 sm:p-5 rounded-2xl border ${t.borderPrimary} shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center`}>
          <p className={`text-[10px] sm:text-xs font-bold ${t.textPrimary} mb-1 leading-tight uppercase tracking-wide`}>Active<br className="sm:hidden" /> Students</p>
          <p className={`text-lg sm:text-3xl font-black ${t.textPrimaryDark}`}>{totalStudentsGlobal}</p>
        </div>
        <div className="bg-blue-50 p-3 sm:p-5 rounded-2xl border border-blue-100 shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center">
          <p className="text-[10px] sm:text-xs font-bold text-blue-600 mb-1 leading-tight uppercase tracking-wide">Total<br className="sm:hidden" /> Capacity</p>
          <p className="text-lg sm:text-3xl font-black text-blue-900">{totalSeatsGlobal}</p>
        </div>
        <div className="bg-emerald-50 p-3 sm:p-5 rounded-2xl border border-emerald-100 shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center">
          <p className="text-[10px] sm:text-xs font-bold text-emerald-600 mb-1 leading-tight uppercase tracking-wide">Avg<br className="sm:hidden" /> Occupancy</p>
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <p className="text-lg sm:text-3xl font-black text-emerald-900">{avgOccupancy}%</p>
            <div className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-bold ${avgOccupancy > 80 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {avgOccupancy > 80 ? 'High' : 'Optimal'}
            </div>
          </div>
        </div>
      </div>

      {/* BRANCH TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Branch Performance</h2>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {libraries.length} Branch{libraries.length !== 1 ? 'es' : ''}
          </span>
        </div>

        {loading ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className={`w-8 h-8 border-4 ${t.borderPrimary} border-t-transparent rounded-full animate-spin`}></div>
            <p className="mt-4 text-slate-500 text-sm">Loading branches..</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center text-rose-600 font-medium">{error}</div>
        ) : libraries.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="text-4xl mb-4">🏛️</div>
            <p className="text-slate-900 font-bold text-lg">No branches added yet</p>
            <p className="text-slate-500 text-sm mt-1 mb-6">Create your first library branch to start managing.</p>
            <Link href="/dashboard/add_library" className={`inline-flex h-10 items-center px-6 bg-gradient-to-r ${t.gradient} text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md ${t.shadow}`}>
              Setup First Branch
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Branch</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Students</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Seats</th>
                  <th className="hidden md:table-cell px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Occupancy</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {libraries.map((lib, idx) => {
                  const occupancy = (lib.totalSeats || 0) > 0
                    ? Math.round(((lib.studentCount || 0) / lib.totalSeats) * 100)
                    : 0;
                  const initial = lib.name.charAt(0).toUpperCase();
                  const avatarColors = [
                    'bg-violet-500', 'bg-blue-500', 'bg-fuchsia-500',
                    'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500',
                  ];
                  const barColors = [
                    'bg-violet-500', 'bg-blue-500', 'bg-fuchsia-500',
                    'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500',
                  ];
                  const badgeStyles = [
                    'bg-violet-50 text-violet-700 border-violet-100',
                    'bg-blue-50 text-blue-700 border-blue-100',
                    'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
                    'bg-emerald-50 text-emerald-700 border-emerald-100',
                    'bg-amber-50 text-amber-700 border-amber-100',
                    'bg-indigo-50 text-indigo-700 border-indigo-100',
                  ];
                  const color = idx % avatarColors.length;

                  return (
                    <tr key={lib.id || lib._id} className={`border-b border-slate-50 hover:${t.bgLight}/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} ${!lib.isActive && userRole !== 'super_admin' ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                      
                      {/* Branch */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Link 
                            href={lib.isActive || userRole === 'super_admin' ? `/dashboard/${lib.slug}` : '#'}
                            onClick={(e) => {
                              if (!lib.isActive && userRole !== 'super_admin') {
                                e.preventDefault();
                                alert("This branch is currently inactive. Please contact administration.");
                              }
                            }}
                            className="flex items-center gap-3 group/link"
                          >
                            <div className={`w-9 h-9 rounded-xl ${lib.isActive ? avatarColors[color] : 'bg-slate-400'} flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0 group-hover/link:scale-105 transition-transform`}>
                              {initial}
                            </div>
                            <div>
                              <p className={`font-bold text-sm text-slate-900 group-hover/link:${t.textPrimary} transition-colors whitespace-nowrap flex items-center gap-2`}>
                                {lib.name}
                                {!lib.isActive && (
                                  <span className="text-[9px] font-black bg-rose-500/20 text-rose-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">Inactive</span>
                                )}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">{lib?.address?.split(',')[0] || 'Branch Area'}</p>
                            </div>
                          </Link>
                        </div>
                      </td>

                      {/* Students */}
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-sm font-black border ${badgeStyles[color]}`}>
                          {lib.studentCount || 0}
                        </span>
                      </td>

                      {/* Seats */}
                      <td className="px-5 py-4 text-center">
                        <span className="text-sm font-bold text-slate-700">{lib.totalSeats || 0}</span>
                      </td>

                      {/* Occupancy bar */}
                      <td className="hidden md:table-cell px-5 py-4 min-w-[180px]">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${occupancy > 90 ? 'bg-rose-500' : barColors[color]}`}
                              style={{ width: `${Math.min(occupancy, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold w-9 text-right ${occupancy > 90 ? 'text-rose-600' : 'text-slate-700'}`}>
                            {occupancy}%
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(lib)}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 text-slate-600 hover:${t.bgPrimary} hover:text-white transition-all shadow-sm`}
                          >
                            <FiEdit2 size={14} />
                          </button>
                          {lib.isActive || userRole === 'super_admin' ? (
                            <Link
                              href={`/dashboard/${lib.slug}`}
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-xl ${avatarColors[color]} text-white hover:opacity-80 transition-all shadow-sm`}
                            >
                              <FiArrowRight size={14} />
                            </Link>
                          ) : (
                            <button
                              onClick={() => alert("This branch is currently inactive. Please contact administration.")}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 text-slate-300 cursor-not-allowed shadow-sm"
                            >
                              <FiArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EditLibraryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingLibrary(null);
        }}
        library={editingLibrary}
        onUpdate={fetchLibraries}
      />
    </div>
  );
}

