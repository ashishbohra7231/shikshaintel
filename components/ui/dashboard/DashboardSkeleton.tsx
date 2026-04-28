export default function DashboardSkeleton() {
  return (
    <div className="w-full mx-auto pb-12 space-y-8 animate-pulse">

      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-violet-50 border border-violet-100 rounded-2xl px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-violet-200 flex-shrink-0" />
          <div className="space-y-2">
            <div className="h-5 w-36 bg-slate-200 rounded-lg" />
            <div className="h-3 w-52 bg-slate-100 rounded-lg" />
          </div>
        </div>
        <div className="h-10 w-36 bg-violet-200 rounded-xl" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          "bg-violet-100",
          "bg-blue-100",
          "bg-emerald-100",
        ].map((color, i) => (
          <div
            key={i}
            className={`${color} rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center text-center gap-2 h-20 sm:h-24`}
          >
            <div className="h-2.5 w-16 bg-white/60 rounded" />
            <div className="h-6 w-12 bg-white/80 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table section skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table header bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="h-4 w-36 bg-slate-200 rounded-lg" />
          <div className="h-6 w-20 bg-slate-100 rounded-full" />
        </div>

        {/* Table head row */}
        <div className="flex gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100">
          <div className="h-3 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-24 bg-slate-100 rounded mx-auto" />
          <div className="h-3 w-24 bg-slate-100 rounded mx-auto hidden md:block" />
          <div className="h-3 w-16 bg-slate-100 rounded ml-auto" />
        </div>

        {/* Table rows */}
        <div className="divide-y divide-slate-50">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-5 py-4 ${i % 2 === 1 ? "bg-slate-50/50" : "bg-white"}`}
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-xl bg-slate-200 flex-shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 bg-slate-200 rounded" />
                  <div className="h-2.5 w-20 bg-slate-100 rounded" />
                </div>
              </div>
              {/* Students badge */}
              <div className="h-7 w-12 bg-slate-100 rounded-lg mx-auto" />
              {/* Seats */}
              <div className="h-4 w-8 bg-slate-100 rounded mx-auto" />
              {/* Occupancy bar */}
              <div className="hidden md:flex flex-1 items-center gap-3 max-w-[180px]">
                <div className="flex-1 h-2 bg-slate-100 rounded-full" />
                <div className="h-3 w-8 bg-slate-100 rounded" />
              </div>
              {/* Action button */}
              <div className="h-8 w-8 rounded-xl bg-slate-200 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
