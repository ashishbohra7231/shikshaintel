export default function LibraryPageSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-violet-50 border border-violet-100 rounded-2xl px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-violet-200 flex-shrink-0" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-slate-200 rounded-lg" />
            <div className="h-3 w-56 bg-slate-100 rounded-lg" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-16 bg-slate-100 rounded-xl" />
          <div className="h-9 w-28 bg-slate-200 rounded-xl" />
          <div className="h-9 w-28 bg-violet-200 rounded-xl" />
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-slate-50 border-slate-100 p-3 sm:p-5 flex flex-col items-center justify-center text-center gap-2 h-24"
          >
            <div className="h-2.5 w-20 bg-slate-200 rounded" />
            <div className="h-6 w-14 bg-slate-300 rounded-lg" />
            <div className="h-2 w-16 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="h-5 w-32 bg-slate-200 rounded-lg" />
            <div className="h-9 w-full md:w-80 bg-slate-100 rounded-lg" />
          </div>
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-7 w-24 bg-slate-100 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-slate-50">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-6 py-4 ${i % 2 === 1 ? "bg-violet-50/20" : ""}`}
            >
              <div className="h-4 w-4 bg-slate-100 rounded" />
              <div className="h-4 w-6 bg-slate-100 rounded" />
              <div className="w-9 h-9 rounded-full bg-slate-100 flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-36 bg-slate-200 rounded" />
                <div className="h-2.5 w-24 bg-slate-100 rounded" />
              </div>
              <div className="h-6 w-14 bg-slate-100 rounded-lg hidden sm:block" />
              <div className="h-5 w-16 bg-slate-100 rounded-full hidden md:block" />
              <div className="h-3 w-20 bg-slate-100 rounded hidden lg:block" />
              <div className="h-7 w-20 bg-slate-100 rounded-lg ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
