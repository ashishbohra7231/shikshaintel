"use client";

import React from "react";
import { FiBell, FiMessageSquare } from "react-icons/fi";

export default function RightPanel() {
  return (
    <div className="flex flex-col w-80 bg-white h-full shrink-0 border-l border-gray-100/50 py-8 px-6 overflow-y-auto scrollbar-hide">
      
      {/* Top Profile / Notifications */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                <FiBell className="w-6 h-6" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                 <FiMessageSquare className="w-6 h-6" />
            </button>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100">
            <img src="https://i.pravatar.cc/150?u=libraria" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Profile Greeting Element */}
      <div className="flex flex-col items-center bg-[#F8F9FB] rounded-3xl p-6 mb-8 text-center border border-gray-100/50">
        <h3 className="font-bold text-gray-900 text-lg">Alex Manager</h3>
        <p className="text-gray-400 text-sm mt-1">Head Librarian</p>
        <button className="mt-4 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white transition-colors bg-white/50 shadow-sm">
            Edit Profile
        </button>
      </div>

      {/* Weekly Activity Chart Static Placeholder */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-gray-900">Activity</h4>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">This Week</span>
        </div>
        <div className="h-32 bg-[#F8F9FB] rounded-3xl border border-gray-100/50 p-4 flex items-end justify-between gap-2">
            {/* CSS Mock Bar Chart */}
            {[40, 70, 45, 90, 65, 30, 80].map((height, i) => (
                <div key={i} className="w-6 bg-indigo-100 rounded-md relative group flex justify-center h-full">
                    <div 
                        className="absolute bottom-0 w-full bg-[#6366F1] rounded-md transition-all hover:bg-indigo-600" 
                        style={{ height: `${height}%` }}
                    ></div>
                </div>
            ))}
        </div>
      </div>

      {/* Recent Members / Assistants */}
      <div>
        <h4 className="font-bold text-gray-900 mb-4">Your Assistants</h4>
        <div className="flex flex-col gap-4">
            {[
                { name: "Sarah Dean", role: "Junior Librarian", avatar: "a04" },
                { name: "Mike Rover", role: "Logistics", avatar: "a05" },
                { name: "Emily Chen", role: "Acquisitions", avatar: "a06" }
            ].map((person, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-[#F8F9FB] rounded-2xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                        <img src={`https://i.pravatar.cc/150?u=${person.avatar}`} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                        <div>
                            <p className="font-bold text-gray-900 text-sm tracking-tight">{person.name}</p>
                            <p className="text-xs text-gray-400">{person.role}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
}
