import React from 'react';

export default function RevenueSkeleton() {
  return (
    <div className="w-full mx-auto pb-10 max-w-[1400px] space-y-10 animate-pulse">
      
      {/* 🟢 GLOBAL REVENUE SUMMARY SKELETON */}
      <section>
        <div className="bg-slate-50 p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200" />
                <div className="h-4 w-32 bg-slate-200 rounded" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="h-12 w-48 bg-slate-300 rounded-xl" />
                <div className="h-4 w-16 bg-slate-200 rounded" />
              </div>
            </div>

            <div className="flex gap-8 bg-white/50 p-6 rounded-xl border border-slate-100 w-full md:w-auto">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-7 w-16 bg-slate-300 rounded-lg" />
              </div>
              <div className="w-px bg-slate-200" />
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-7 w-20 bg-slate-300 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 ANALYTICS CHARTS SKELETON */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-300 rounded-lg" />
            <div className="h-3 w-64 bg-slate-200 rounded" />
          </div>
          <div className="h-10 w-40 bg-slate-200 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-slate-300 rounded" />
                  <div className="h-3 w-48 bg-slate-200 rounded" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100" />
              </div>
              <div className="h-[300px] w-full bg-slate-50 rounded-xl" />
            </div>
          ))}
        </div>
      </section>

      {/* 🏢 BRANCH REVENUE BREAKDOWN SKELETON */}
      <section>
        <div className="h-6 w-40 bg-slate-300 rounded-lg mb-6 ml-2" />
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 w-[35%]"><div className="h-3 w-24 bg-slate-200 rounded" /></th>
                  <th className="px-6 py-4 w-[15%]"><div className="h-3 w-16 bg-slate-200 rounded mx-auto" /></th>
                  <th className="px-6 py-4 w-[25%]"><div className="h-3 w-20 bg-slate-200 rounded" /></th>
                  <th className="px-6 py-4 w-[20%] text-right"><div className="h-3 w-24 bg-slate-200 rounded ml-auto" /></th>
                  <th className="px-6 py-4 w-[5%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg bg-slate-200 shrink-0" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-slate-300 rounded" />
                          <div className="h-3 w-24 bg-slate-200 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-4 w-8 bg-slate-300 rounded" />
                        <div className="h-3 w-10 bg-slate-100 rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-3">
                        <div className="h-2 w-16 bg-slate-100 rounded" />
                        <div className="w-full bg-slate-100 h-1.5 rounded-full" />
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="h-5 w-20 bg-slate-300 rounded ml-auto" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-6 w-6 bg-slate-100 rounded-full ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
