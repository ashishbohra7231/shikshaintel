"use client";

import React from "react";
import { FiMoreVertical } from "react-icons/fi";

export default function StatisticCard() {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col mb-8 relative border border-gray-50">
      
      {/* Menu Dots */}
      <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
        <FiMoreVertical className="w-5 h-5" />
      </button>
      
      <h3 className="font-bold text-gray-900 text-lg mb-6">Statistic</h3>

      {/* Avatar with Circular Ring */}
      <div className="flex justify-center mb-6 relative">
          <div className="w-28 h-28 rounded-full border-4 border-indigo-50 border-r-[#6366F1] border-t-[#6366F1] flex items-center justify-center relative rotate-45">
             <img src="https://i.pravatar.cc/150?u=jason1" className="w-24 h-24 rounded-full object-cover -rotate-45" alt="Jason" />
             <div className="absolute top-0 right-0 bg-[#6366F1] text-white text-[0.6rem] px-1.5 py-0.5 rounded-full font-bold -rotate-45 -translate-y-2 translate-x-2">
                 32%
             </div>
          </div>
      </div>

      {/* Greeting */}
      <div className="text-center mb-10">
        <h4 className="text-xl font-bold text-gray-900 mb-1">
            Good Morning Jason <span className="inline-block hover:scale-110 transition-transform cursor-pointer">🔥</span>
        </h4>
        <p className="text-xs text-gray-400 font-medium tracking-tight">Continue your managing to achieve your target!</p>
      </div>

      {/* Custom Bar Chart Mockup */}
      <div className="bg-[#F8F9FB] rounded-2xl p-5 border border-white h-44 flex flex-col justify-end relative shadow-inner">
         {/* Y-axis labels */}
         <div className="absolute left-4 top-5 bottom-8 flex flex-col justify-between text-[0.6rem] font-bold text-gray-400">
             <span>60</span>
             <span>40</span>
             <span>20</span>
         </div>

         {/* Bars */}
         <div className="flex justify-between items-end h-full w-full pl-6 pr-2 z-10 gap-2">
             <div className="w-full bg-[#D8B4FE]/50 rounded-md h-[40%] hover:bg-[#D8B4FE]/70 transition-colors"></div>
             <div className="w-full bg-[#8B5CF6] rounded-md h-[55%] shadow-sm shadow-[#8B5CF6]/30 hover:bg-[#7C3AED] transition-colors"></div>
             <div className="w-full bg-[#D8B4FE]/50 rounded-md h-[30%] hover:bg-[#D8B4FE]/70 transition-colors"></div>
             <div className="w-full bg-[#6366F1] rounded-md h-[95%] shadow-md shadow-[#6366F1]/30 hover:bg-indigo-600 transition-colors relative">
                 {/* Tooltip hint on hover (implied) */}
             </div>
             <div className="w-full bg-[#D8B4FE]/50 rounded-md h-[20%] hover:bg-[#D8B4FE]/70 transition-colors"></div>
         </div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between w-full pl-10 pr-6 mt-3 text-[0.6rem] font-bold text-gray-400">
           <span>1-10 Aug</span>
           <span>11-20 Aug</span>
           <span>21-30 Aug</span>
      </div>

    </div>
  );
}
