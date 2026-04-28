"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { FiMapPin } from "react-icons/fi";

interface LibraryCardProps {
  name: string;
  address: string;
  detail: string;
  seats: number;
  students: number;
  revenue?: number;
  image?: string;
  slug?: string;
}

export default function LibraryCard({ name, address, detail, seats, students, revenue = 0, slug }: LibraryCardProps) {
  const router = useRouter();
  const href = slug ? `/dashboard/${slug}` : "/dashboard";
  const initial = name ? name.charAt(0).toUpperCase() : "L";
  const occupancy = seats > 0 ? Math.round((students / seats) * 100) : 0;

  const colors = [
    "from-indigo-600 to-indigo-800",
    "from-emerald-600 to-emerald-800",
    "from-rose-600 to-rose-800",
    "from-amber-600 to-amber-800",
    "from-violet-600 to-violet-800",
    "from-cyan-600 to-cyan-800",
  ];
  const colorIndex = (name?.length || 0) % colors.length;
  const gradient = colors[colorIndex];

  const handleCardClick = () => {
    router.push(href);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-[3rem] p-4 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col cursor-pointer border border-slate-100 h-full relative"
    >
      {/* Revenue Badge */}
      <div className="absolute top-8 right-8 z-10 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-[10px] font-black text-white uppercase tracking-widest border border-white/30 shadow-sm">
        Revenue: ₹{revenue.toLocaleString()}
      </div>

      {/* Header with Initial */}
      <div className={`w-full h-[180px] rounded-[2.5rem] mb-8 relative overflow-hidden bg-gradient-to-tr ${gradient} flex items-center justify-center p-8 transition-all duration-700`}>
         <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <span className="text-white text-8xl font-black transition-transform group-hover:scale-110 group-hover:-rotate-6 duration-700 drop-shadow-2xl">{initial}</span>
      </div>

      <div className="px-5 flex-1 flex flex-col pb-6">
        {/* Name & Address */}
        <div className="mb-6">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-3 group-hover:text-indigo-600 transition-colors uppercase italic">{name}</h3>
          <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
             <FiMapPin size={14} />
             {address}
          </p>
        </div>

        {/* Occupancy Indicator */}
        <div className="mb-8">
           <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Occupancy</span>
              <span className={`text-xs font-black ${occupancy > 90 ? 'text-rose-600' : 'text-emerald-600'}`}>{occupancy}%</span>
           </div>
           <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${occupancy > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                style={{ width: `${occupancy}%` }}
              ></div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 group-hover:bg-indigo-50/30 transition-colors">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Seats</p>
              <p className="text-xl font-black text-slate-900 leading-none">{seats}</p>
           </div>
           <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 group-hover:bg-indigo-50/30 transition-colors">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Students</p>
              <p className="text-xl font-black text-slate-900 leading-none">{students}</p>
           </div>
        </div>

        {/* Quick Action Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/${slug}/add_student`);
          }}
          className="w-full py-4 bg-slate-950 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 transition-all active:scale-95"
        >
          Add Student Now
        </button>
      </div>
    </div>
  );
}
