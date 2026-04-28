"use client";

import React from "react";
import { FiPlus, FiUserPlus } from "react-icons/fi";

export default function MentorCard() {
  const mentors = [
    { name: "Padhang Satrio", role: "Mentor", avatar: "a10" },
    { name: "Zakir Horizontal", role: "Mentor", avatar: "a11" },
    { name: "Leonardo Samsul", role: "Mentor", avatar: "a12" },
  ];

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col border border-gray-50">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 text-lg tracking-tight">Your mentor</h3>
          <button className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#6366F1] hover:border-[#6366F1]/30 transition-colors shadow-sm">
             <FiPlus className="w-4 h-4" />
          </button>
      </div>

      {/* Mentor List */}
      <div className="flex flex-col gap-0 relative">
          {/* Subtle vertical dotted line connecting them (Optional aesthetic) */}
          <div className="absolute left-[1.15rem] top-8 bottom-8 w-px border-l-2 border-dotted border-gray-100 z-0 hidden"></div>

          {mentors.map((mentor, index) => (
             <div key={mentor.name} className={`flex items-center justify-between py-4 z-10 ${index !== mentors.length - 1 ? 'border-b border-gray-50 border-dashed' : ''}`}>
                 <div className="flex items-center gap-4">
                     <div className="relative">
                         <img src={`https://i.pravatar.cc/150?u=${mentor.avatar}`} className="w-10 h-10 rounded-full object-cover bg-orange-100 shadow-sm" alt={mentor.name} />
                         {/* Online indicator dot */}
                         <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-800 border-2 border-white rounded-full flex items-center justify-center">
                             <div className="w-1 h-1 bg-white rounded-full"></div>
                         </div>
                     </div>
                     <div>
                         <p className="text-sm font-bold text-gray-900 leading-tight">{mentor.name}</p>
                         <p className="text-[0.7rem] font-medium text-gray-400 mt-0.5">{mentor.role}</p>
                     </div>
                 </div>
                 
                 {/* Follow Button */}
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-100 text-[#6366F1] font-bold text-[0.7rem] hover:bg-[#F8F9FB] shadow-sm transition-colors">
                      <FiUserPlus className="w-3 h-3" />
                      Follow
                  </button>
             </div>
          ))}
      </div>

      {/* Load More Button */}
      <button className="mt-4 w-full py-3.5 bg-[#F8F9FB] text-[#6366F1] rounded-2xl font-bold text-[0.8rem] hover:bg-[#EEF2FF] transition-colors shadow-sm">
          See All
      </button>

    </div>
  );
}
