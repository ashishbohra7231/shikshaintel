"use client";

import React from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export default function AddLibraryCard() {
  return (
    <Link
      href="/dashboard/add_library"
      className="flex flex-col items-center justify-center h-full min-h-[290px] w-full rounded-3xl border-2 border-dashed border-gray-200 bg-white/50 hover:bg-white hover:border-[#6366F1]/40 hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] transition-all duration-300 group cursor-pointer"
    >
      <div className="w-16 h-16 rounded-full bg-[#F8F9FB] group-hover:bg-[#6366F1] text-gray-400 group-hover:text-white flex items-center justify-center mb-5 transition-all shadow-sm">
        <FiPlus className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-700 group-hover:text-[#6366F1] transition-colors">
        New Branch
      </h3>
      <p className="text-sm text-gray-400 mt-1 text-center max-w-[200px]">
        Deploy a new library branch location
      </p>
    </Link>
  );
}
