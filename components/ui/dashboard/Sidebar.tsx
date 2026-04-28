"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { 
  FiGrid, 
  FiBell, 
  FiUserPlus, 
  FiPlusCircle, 
  FiPieChart, 
  FiChevronDown, 
  FiLogOut,
  FiX,
  FiHome,
  FiCreditCard
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import ApiDataController from "@/controllers/masters";
import { Constants } from "@/constants/Constants";

interface LibraryItem {
  id?: string;
  _id?: string;
  name: string;
  slug?: string;
  isActive?: boolean;
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { theme, t } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [libraries, setLibraries] = useState<LibraryItem[]>([]);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("app-auth");
    if (onClose) onClose();
    router.push("/");
  };

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLibraries() {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
        if (!token) return;

        // Decode token for role
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserRole(payload.role);
        } catch (e) {}

        const apiController = new ApiDataController(token);
        const data = await apiController.GetApiWithToken(Constants.get_libraries_url);
        const items = Array.isArray(data) ? data : data?.libraries || data?.data || [];
        setLibraries(items);
      } catch (e) {
        console.error("Failed to fetch libraries for sidebar", e);
      }
    }
    fetchLibraries();
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <FiGrid size={18} /> },
    ...(userRole === "super_admin" ? [
      { name: "Platform Control", href: "/dashboard/super-admin", icon: <FiGrid size={18} className="text-amber-400" /> }
    ] : []),
    { name: "Notifications", href: "/dashboard/notifications", icon: <FiBell size={18} /> },
    {
      name: "Add Student",
      icon: <FiUserPlus size={18} />,
      isSubmenu: true,
      isOpen: isAddStudentOpen,
      toggle: () => setIsAddStudentOpen(!isAddStudentOpen),
      subItems: libraries.map(lib => ({
        name: lib.name,
        isActive: lib.isActive,
        href: `/dashboard/${lib.slug || (lib.name ? lib.name.toLowerCase().replace(/\s+/g, "-") : "branch")}/add_student`
      }))
    },
    {
      name: "Branches",
      icon: <FiHome size={18} />,
      isSubmenu: true,
      isOpen: isBranchesOpen,
      toggle: () => setIsBranchesOpen(!isBranchesOpen),
      subItems: libraries.map(lib => ({
        name: lib.name,
        isActive: lib.isActive,
        href: `/dashboard/${lib.slug || lib.name.toLowerCase().replace(/\s+/g, "-")}`
      }))
    },
    { name: "Add New Library", href: "/dashboard/add_library", icon: <FiPlusCircle size={18} /> },
    { name: "Total Revenue", href: "/dashboard/revenue", icon: <FiPieChart size={18} /> },
    { name: "Bill", href: "/dashboard/billing", icon: <FiCreditCard size={18} /> },
  ];

  return (
    <aside className="h-screen flex flex-col justify-between py-5 px-4 bg-[#0f0f1a] border-r border-white/5 overflow-y-auto overflow-x-hidden">
      
      {/* TOP */}
      <div className="flex flex-col gap-8">

        {/* LOGO + CLOSE */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Logo darkTheme />
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-all">
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-1">
          <p className="px-3 text-[10px] font-bold text-white/25 uppercase tracking-[0.15em] mb-1">Menu</p>

          {navItems.map((item) => {
            if (item.isSubmenu) {
              const anySubActive = item.subItems?.some(sub => pathname === sub.href);
              return (
                <div key={item.name} className="flex flex-col gap-0.5">
                  <button
                    onClick={item.toggle}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all text-left ${
                      item.isOpen || anySubActive
                        ? `${t.bgPrimary}/20 text-white`
                        : "text-white/50 hover:bg-white/5 hover:text-white/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 ${item.isOpen || anySubActive ? `text-${t.primary}-400` : "text-white/30"}`}>
                        {item.icon}
                      </div>
                      <span className="font-semibold text-sm">{item.name}</span>
                    </div>
                    <FiChevronDown
                      size={13}
                      className={`transition-transform flex-shrink-0 ${item.isOpen ? "rotate-180" : ""} ${item.isOpen || anySubActive ? `text-${t.primary}-400` : "text-white/25"}`}
                    />
                  </button>

                  {item.isOpen && (
                    <div className="flex flex-col gap-0.5 ml-4 mt-0.5 pl-3 border-l border-white/10">
                      {item.subItems && item.subItems.length > 0 ? (
                        item.subItems.map((subItem:any) => {
                            const isBranchActive = subItem.isActive !== false; // Default to true if undefined
                            const canAccess = isBranchActive || userRole === "super_admin";
                            
                            return (
                              <Link
                                key={subItem.name}
                                href={canAccess ? subItem.href : "#"}
                                onClick={(e) => {
                                  if (!canAccess) {
                                    e.preventDefault();
                                    alert("This branch is currently inactive. Please contact administration.");
                                  } else if (onClose) {
                                    onClose();
                                  }
                                }}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all truncate ${
                                  pathname === subItem.href
                                    ? `${t.bgPrimary}/20 text-white`
                                    : !canAccess
                                      ? "text-white/20 cursor-not-allowed"
                                      : "text-white/40 hover:text-white/75 hover:bg-white/5"
                                }`}
                              >
                              <span>{subItem.name}</span>
                              {!isBranchActive && (
                                <span className="text-[9px] font-black bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                  Inactive
                                </span>
                              )}
                            </Link>
                          );
                        })
                      ) : (
                        <p className="px-2 py-2 text-[11px] text-white/25 italic">No libraries available</p>
                      )}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href || "#"}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${t.gradient.split(' ').map(c => `${c}/30`).join(' ')} text-white shadow-sm border ${t.borderPrimary}/20`
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                <div className={`flex-shrink-0 ${isActive ? `text-white` : "text-white/30"}`}>
                  {item.icon}
                </div>
                <span className={`font-semibold text-sm ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                {isActive && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-${t.primary}-400`} />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all font-semibold text-sm group"
        >
          <FiLogOut size={17} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
