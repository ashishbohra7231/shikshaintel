interface MessageBoxProps {
  open: boolean;
  title: string;
  description: string;
}

export default function MessageBox({ open, title, description }: MessageBoxProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl border border-slate-100 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
             {title}
          </h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
             {description}
          </p>
        </div>
      </div>
    </div>
  );
}
