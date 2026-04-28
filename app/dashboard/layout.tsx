"use client";
import Sidebar from "@/components/ui/dashboard/Sidebar";
import NotificationBell from "@/components/ui/dashboard/NotificationBell";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi";

export default function DashboardLayout({ children }: any) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
    if (!token) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium text-sm">Loading Dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar - Fixed Width */}
      <div className={`fixed left-0 top-0 w-[260px] h-screen z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[260px] w-full transition-all duration-300">

        {/* Navbar - Standard SaaS */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 h-20 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <FiMenu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
              Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-[12px] font-medium text-slate-600">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-4">
              <NotificationBell />

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100 cursor-pointer">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-semibold text-slate-900">
                    Administrator
                  </span>
                  <span className="text-[11px] text-slate-500">Root Admin</span>
                </div>

                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center border border-slate-300">
                  <span className="text-slate-600 font-bold">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 w-full max-w-[100vw] overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}