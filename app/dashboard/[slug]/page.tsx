"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { 
  FiSave, 
  FiUser, 
  FiMonitor, 
  FiX, 
  FiUserPlus, 
  FiSearch, 
  FiUsers, 
  FiBookOpen, 
  FiTrash2, 
  FiEdit,
  FiClock,
  FiSend,
  FiUpload,
  FiDownload,
  FiXCircle,
  FiPhone,
  FiMail
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import ApiDataController from "@/controllers/masters";
import { Constants } from "@/constants/Constants";
import { date } from "yup";
import { useTheme } from "@/context/ThemeContext";
import LibraryPageSkeleton from "@/components/ui/dashboard/LibraryPageSkeleton";

interface LibraryPricing {
  half_day: { monthly: number; quarterly: number; yearly: number };
  full_day: { monthly: number; quarterly: number; yearly: number };
}

interface LibraryStudent {
  seatNumber: number;
  shift: string;
}

interface LibraryDetail {
  id?: string;
  _id?: string;
  name: string;
  address: string;
  detail: string;
  seats?: number;
  totalSeats?: number;
  students?: LibraryStudent[];
  studentCount?: number;
  image?: string;
  shifts?: {
    morning?: { start: string; end: string };
    evening?: { start: string; end: string };
    fullDay?: { start: string; end: string };
  };
  pricing?: LibraryPricing;
  slug?: string;
  [key: string]: any;
}

interface SeatState {
  seatNumber: number;
  takenMorning: boolean;
  takenEvening: boolean;
  takenFullDay: boolean;
}

const priceForPlan = (library: LibraryDetail | null, selectedShift: string, selectedPlan: string) => {
  if (!library?.pricing) return 0;
  const shiftKey = selectedShift === "fullDay" ? "full_day" : "half_day";
  const pricingGroup = library.pricing[shiftKey as keyof LibraryPricing];
  if (!pricingGroup) return 0;
  return pricingGroup[selectedPlan as keyof typeof pricingGroup] ?? 0;
};

const normalizeShift = (rawShift: string | undefined) => {
  if (!rawShift) return "";
  return rawShift.toString().trim().toLowerCase().replace(/[\s_-]/g, "");
};

interface StudentDetail {
  _id: string;
  name: string;
  phone: string;
  email: string;
  seatNumber: number;
  planType: string;
  originalPrice: number;
  discount: number;
  shift: string;
  status: string;
  isActive: boolean;
  startDate: string;
  expiryDate: string;
  finalPrice: number;
  [key: string]: any;
}

function BulkUploadModal({ show, onClose, library, onSuccess }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  if (!show) return null;

  const handleFileUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const headers = lines[0].toLowerCase().split(",").map(h => h.trim());
        
        const studentsToUpload = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(",").map(v => v.trim());
          const student: any = {};
          headers.forEach((header, index) => {
             // Map CSV headers to internal keys
             let key = header;
             if (header.includes("name")) key = "name";
             if (header.includes("phone")) key = "phone";
             if (header.includes("seat")) key = "seatNumber";
             if (header.includes("shift")) key = "shift";
             if (header.includes("plan")) key = "planType";
             if (header.includes("email")) key = "email";
             if (header.includes("expiry") || header.includes("end")) key = "expiryDate";
             if (header.includes("start") || header === "date") key = "startDate";
             if (header.includes("price") || header.includes("amount")) key = "originalPrice";
             
             student[key] = values[index];
          });
          studentsToUpload.push(student);
        }

        setProgress({ current: 0, total: studentsToUpload.length });
        
        const formatDateForServer = (dateStr: string) => {
          if (!dateStr) return null;
          let cleanDate = dateStr.trim();
          
          // Handle DD/MM/YYYY or DD-MM-YYYY
          if (cleanDate.includes("/") || (cleanDate.includes("-") && cleanDate.split("-")[0].length < 4)) {
            const parts = cleanDate.split(/[\/\-]/);
            if (parts.length === 3) {
              // Assume DD is first, MM is second, YYYY is third
              const day = parts[0].padStart(2, '0');
              const month = parts[1].padStart(2, '0');
              const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
              return `${year}-${month}-${day}`;
            }
          }
          
          // Try standard parsing
          const d = new Date(cleanDate);
          if (!isNaN(d.getTime())) {
            return d.toISOString().split("T")[0];
          }
          return cleanDate;
        };

        const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
        const apiController = new ApiDataController(token || "");

        for (let i = 0; i < studentsToUpload.length; i++) {
          const s = studentsToUpload[i];
          const payload = {
            libraryId: library?._id || library?.id,
            name: s.name,
            phone: s.phone,
            email: s.email || `${s.name?.toLowerCase().replace(/\s/g, "")}@example.com`,
            seatNumber: Number(s.seatNumber),
            shift: s.shift || "morning",
            planType: s.planType || "monthly",
            originalPrice: Number(s.originalPrice) || 0,
            startDate: formatDateForServer(s.startDate) || new Date().toISOString().split("T")[0],
            expiryDate: formatDateForServer(s.expiryDate)
          };

          console.log("Uploading student with payload:", payload);

          try {
            await apiController.PostApiWithToken(Constants.add_student_url, payload);
          } catch (err) {
            console.error(`Failed to upload student: ${s.name}`, err);
          }
          setProgress(prev => ({ ...prev, current: i + 1 }));
        }

        onSuccess();
        onClose();
      } catch (err) {
        console.error(err);
        setError("Failed to parse CSV file. Please check the format.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const headers = "name,phone,email,seatNumber,shift,planType,startDate,expiryDate,price\n";
    const sampleData = "John Doe,9876543210,john@example.com,1,fullDay,monthly,2026-04-20,2026-05-20,500\nJane Smith,9123456789,jane@example.com,2,morning,quarterly,2026-04-01,2026-07-01,1200";
    const blob = new Blob([headers + sampleData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shikshadesk_onboarding_template.csv";
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Bulk Onboarding</h3>
            <button 
              onClick={downloadTemplate}
              className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline mt-1"
            >
              Download CSV Template
            </button>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center">
            <input 
              type="file" 
              accept=".csv" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden" 
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
              <FiUpload size={32} className="text-indigo-600 mb-3" />
              <p className="text-sm font-bold text-slate-700">{file ? file.name : "Select CSV File"}</p>
              <p className="text-xs text-slate-500 mt-1">Format: name, phone, seat, shift, expiry</p>
            </label>
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Uploading Students</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleFileUpload}
              disabled={!file || uploading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition-all disabled:opacity-50"
            >
              {uploading ? "Processing..." : "Start Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LibrarySlugPage() {
  const { theme, t } = useTheme();
  const isGreenTheme = theme !== "violet";
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string | undefined;

  const [library, setLibrary] = useState<LibraryDetail | null>(null);
  const [students, setStudents] = useState<StudentDetail[]>([]);
  const [searchName, setSearchName] = useState("");
  const [sortKey, setSortKey] = useState<keyof StudentDetail>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [studentToDeactivate, setStudentToDeactivate] = useState<StudentDetail | null>(null);
  const [studentToReactivate, setStudentToReactivate] = useState<StudentDetail | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<StudentDetail | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentDetail | null>(null);
  const [stats, setStats] = useState<{ totalRevenue: number; studentsAdded: number } | null>(null);
  const [reactivateCycleOption, setReactivateCycleOption] = useState<"same" | "new">("same");
  const [showSeatPopup, setShowSeatPopup] = useState(false);
  const [expiringToday, setExpiringToday] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterShift, setFilterShift] = useState("all");
  const [filterExpiry, setFilterExpiry] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteProgress, setDeleteProgress] = useState({ current: 0, total: 0 });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [newCycleData, setNewCycleData] = useState({
    seatNumber: "",
    planType: "monthly",
    shift: "morning",
    discount: "0",
    lockerCharges: "0"
  });

  const originalPrice = useMemo(() => priceForPlan(library, newCycleData.shift, newCycleData.planType), [library, newCycleData.shift, newCycleData.planType]);
  const finalPrice = Math.max(0, originalPrice - Math.max(0, Number(newCycleData.discount || 0)) + Math.max(0, Number(newCycleData.lockerCharges || 0)));

  const availablePlanTypes = useMemo(() => {
    if (!library?.pricing) return ["monthly", "quarterly", "yearly"];
    return Object.keys(library.pricing.half_day) as string[];
  }, [library]);

  const availableShifts = useMemo(() => {
    if (!library?.shifts) return ["morning", "evening", "fullDay"];
    return Object.keys(library.shifts) as string[];
  }, [library]);

  const seatStates = useMemo(() => {
    if (!library?.totalSeats) return [] as SeatState[];
    const allStudents = Array.isArray(students) ? students : [];

    return Array.from({ length: library.totalSeats }, (_, index) => {
      const seatNo = index + 1;
      const seatStudents = allStudents.filter((student) =>
        student.isActive && Number(student?.seatNumber) === seatNo
      );
      const takenMorning = seatStudents.some((student) => normalizeShift(student?.shift) === "morning");
      const takenEvening = seatStudents.some((student) => normalizeShift(student?.shift) === "evening");
      const takenFullDay = seatStudents.some((student) => normalizeShift(student?.shift) === "fullday");

      return { seatNumber: seatNo, takenMorning, takenEvening, takenFullDay };
    });
  }, [library, students]);

  const seatUnavailable = (seat: SeatState) => {
    const currentShift = normalizeShift(newCycleData.shift);
    if (seat.takenFullDay) return true;
    if (currentShift === "morning") return seat.takenMorning;
    if (currentShift === "evening") return seat.takenEvening;
    if (currentShift === "fullday") return seat.takenMorning || seat.takenEvening;
    return false;
  };

  const { fullAvailableCount, halfAvailableCount } = useMemo(() => {
    let full = 0;
    let half = 0;
    seatStates.forEach((seat) => {
      if (seat.takenFullDay) return;
      if (!seat.takenMorning && !seat.takenEvening) {
        full++;
      } else if (seat.takenMorning !== seat.takenEvening) {
        half++;
      }
    });
    return { fullAvailableCount: full, halfAvailableCount: half };
  }, [seatStates]);

  const availableSeatNumbers = useMemo(() => {
    return seatStates.filter((seat) => !seatUnavailable(seat)).map((seat) => seat.seatNumber);
  }, [seatStates, newCycleData.shift]);

  const executeStatusChange = async (student: StudentDetail, resetCycle: boolean = false) => {
    try {
      // ID Fallback: try _id first, then id
      const studentId = student._id || (student as any).id;
      if (!studentId) {
        alert("Student ID is missing. Cannot update status.");
        return;
      }

      if (resetCycle && !newCycleData.seatNumber) {
        alert("Please select a seat from the map before starting a new cycle.");
        return;
      }

      if (!student.isActive && !resetCycle) {
        let finalExpiry = new Date(student.expiryDate);
        if (student.planType === "monthly") finalExpiry.setMonth(finalExpiry.getMonth() + 1);
        else if (student.planType === "quarterly") finalExpiry.setMonth(finalExpiry.getMonth() + 3);
        else if (student.planType === "yearly") finalExpiry.setFullYear(finalExpiry.getFullYear() + 1);
        
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (finalExpiry < now) {
          alert("Cannot keep the same cycle because the student's next expiry date would still be in the past. Please select 'Start New Cycle'.");
          return;
        }
      }

      setTogglingId(studentId);
      const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
      if (!token) return;
      const apiController = new ApiDataController(token);

      if (student.isActive) {
        // Deactivate using PUT as requested/compatible
        const endpoint = `${Constants.add_student_url}/${studentId}/deactivate`;
        await apiController.PutApiWithToken(endpoint, {});
      } else {
        if (resetCycle) {
          // New Cycle -> Update seat, plan, shift using PUT to /students/:studentId
          const endpoint = `${Constants.add_student_url}/${studentId}`;
          await apiController.PutApiWithToken(endpoint, {
            libraryId: library?._id || library?.id,
            seatNumber: Number(newCycleData.seatNumber),
            planType: newCycleData.planType,
            shift: newCycleData.shift,
            originalPrice: originalPrice,
            discount: Math.max(0, Number(newCycleData.discount) || 0),
            lockerCharges: Math.max(0, Number(newCycleData.lockerCharges) || 0),
            finalPrice: finalPrice,
            startDate: new Date().toISOString(),
            isActive: true,
            status: "active"
          });
        } else {
          // Existing -> Reactivate endpoint
          const endpoint = `${Constants.add_student_url}/${studentId}/reactivate`;
          await apiController.PutApiWithToken(endpoint, { resetCycle });
        }
      }

      setStudents(prev => prev.map(s => {
        const sid = s._id || (s as any).id;
        if (sid === studentId) {
          if (!student.isActive && resetCycle) {
            const sDate = new Date();
            const eDate = new Date(sDate);
            if (newCycleData.planType === "monthly") eDate.setMonth(eDate.getMonth() + 1);
            else if (newCycleData.planType === "quarterly") eDate.setMonth(eDate.getMonth() + 3);
            else if (newCycleData.planType === "yearly") eDate.setFullYear(eDate.getFullYear() + 1);

            return {
              ...s,
              isActive: true,
              status: "active",
              seatNumber: Number(newCycleData.seatNumber),
              planType: newCycleData.planType,
              shift: newCycleData.shift,
              originalPrice: originalPrice,
              discount: Math.max(0, Number(newCycleData.discount) || 0),
              lockerCharges: Math.max(0, Number(newCycleData.lockerCharges) || 0),
              finalPrice: finalPrice,
              startDate: sDate.toISOString(),
              expiryDate: eDate.toISOString()
            };
          } else if (!student.isActive && !resetCycle) {
            let eDate = new Date(s.expiryDate);
            if (s.planType === "monthly") eDate.setMonth(eDate.getMonth() + 1);
            else if (s.planType === "quarterly") eDate.setMonth(eDate.getMonth() + 3);
            else if (s.planType === "yearly") eDate.setFullYear(eDate.getFullYear() + 1);
            
            return {
              ...s,
              isActive: true,
              status: "active",
              expiryDate: eDate.toISOString()
            };
          }
          return {
            ...s,
            isActive: !s.isActive,
            status: !s.isActive ? "active" : "inactive"
          };
        }
        return s;
      }));
      
      // Close modals on success
      setStudentToDeactivate(null);
      setStudentToReactivate(null);
    } catch (e) {
      console.error("Failed to toggle student status", e);
      alert("Failed to update status. Please check your internet or permissions.");
    } finally {
      setTogglingId(null);
    }
  };

  const occupiedSameCycle = useMemo(() => {
    if (!studentToReactivate) return false;
    const seat = seatStates.find(s => s.seatNumber === studentToReactivate.seatNumber);
    if (!seat) return false;

    const currentShift = normalizeShift(studentToReactivate.shift);
    
    // Conflict if SEAT is taken for fullDay
    if (seat.takenFullDay) return true;
    
    // Conflict if WE want fullDay but seat is taken for morning OR evening
    if (currentShift === "fullday" && (seat.takenMorning || seat.takenEvening)) return true;
    
    // Conflict if WE want morning/evening and seat is taken for that specific shift
    if (currentShift === "morning" && seat.takenMorning) return true;
    if (currentShift === "evening" && seat.takenEvening) return true;
    
    return false;
  }, [studentToReactivate, seatStates]);

  const handleEditStudent = async (studentId: string, updates: Partial<StudentDetail>) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
      const apiController = new ApiDataController(token || "");
      await apiController.PutApiWithToken(`${Constants.add_student_url}/${studentId}`, {
        ...updates,
        libraryId: library?._id || library?.id
      });
      setStudents(prev => prev.map(s => s._id === studentId ? { ...s, ...updates } : s));
      setStudentToEdit(null);
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to update student details");
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
      const apiController = new ApiDataController(token || "");
      await apiController.DeleteApiWithToken(`${Constants.add_student_url}/${studentId}`);
      setStudents(prev => prev.filter(s => s._id !== studentId));
      setStudentToDelete(null);
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to delete student");
    }
  };

  const handleSendManualReminder = async (student: StudentDetail) => {
    try {
      const sid = student._id || (student as any).id;
      if (!sid) return;

      setSendingReminderId(sid);
      const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
      const apiController = new ApiDataController(token || "");
      
      const res = await apiController.PostApiWithToken(`${Constants.send_reminder_url}${sid}/send-reminder`, {});
      alert(res?.message || "Reminder sent successfully!");
      
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to send WhatsApp reminder. Please check your token or student phone number.");
    } finally {
      setSendingReminderId(null);
    }
  };

  const toggleSelect = (id: string) => {
    if (!id) return;
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (students: StudentDetail[]) => {
    const ids = students.map(s => s._id || (s as any).id).filter(Boolean);
    if (selectedIds.length === ids.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ids);
    }
  };

  const handleBulkExport = () => {
    const selectedStudents = students.filter(s => {
      const sid = s._id || (s as any).id;
      return selectedIds.includes(sid);
    });
    if (selectedStudents.length === 0) return;

    const headers = "name,phone,email,seatNumber,shift,planType,startDate,expiryDate,finalPrice\n";
    const csvContent = selectedStudents.map(s => 
      `${s.name},${s.phone},${s.email},${s.seatNumber},${s.shift},${s.planType},${s.startDate},${s.expiryDate},${s.finalPrice}`
    ).join("\n");

    const blob = new Blob([headers + csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} students? This cannot be undone.`)) return;

    const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
    const apiController = new ApiDataController(token || "");

    setIsDeleting(true);
    setDeleteProgress({ current: 0, total: selectedIds.length });
    
    console.log("Starting bulk delete for IDs:", selectedIds);

    for (let i = 0; i < selectedIds.length; i++) {
      const id = selectedIds[i];
      try {
        await apiController.DeleteApiWithToken(`${Constants.add_student_url}/${id}`);
        console.log(`Deleted student: ${id}`);
      } catch (err) {
        console.error(`Failed to delete student ${id}:`, err);
      }
      setDeleteProgress(prev => ({ ...prev, current: i + 1 }));
    }
    
    setStudents(prev => prev.filter(s => {
      const sid = s._id || (s as any).id;
      return !selectedIds.includes(sid);
    }));
    setSelectedIds([]);
    setIsDeleting(false);
    alert("Bulk deletion completed.");
  };

  const handleToggleStatus = (student: StudentDetail) => {
    if (student.isActive) {
      setStudentToDeactivate(student);
    } else {
      setStudentToReactivate(student);
      
      const seat = seatStates.find(s => s.seatNumber === student.seatNumber);
      let isOccupied = false;
      if (seat) {
        const currentShift = normalizeShift(student.shift);
        if (seat.takenFullDay) isOccupied = true;
        if (currentShift === "fullday" && (seat.takenMorning || seat.takenEvening)) isOccupied = true;
        if (currentShift === "morning" && seat.takenMorning) isOccupied = true;
        if (currentShift === "evening" && seat.takenEvening) isOccupied = true;
      }
      
      setReactivateCycleOption(isOccupied ? "new" : "same");
      setNewCycleData({
        seatNumber: "",
        planType: student.planType || "monthly",
        shift: student.shift || "morning",
        discount: student.discount?.toString() || "0",
        lockerCharges: student.lockerCharges?.toString() || "0"
      });
    }
  };

  const filteredStudents = useMemo(() => {
    const query = searchName.trim().toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return students.filter((student) => {
      // Name Search
      if (query && !student.name.toLowerCase().includes(query)) return false;

      // Status Filter
      if (filterStatus !== "all") {
        const isCurrentlyActive = student.isActive;
        if (filterStatus === "active" && !isCurrentlyActive) return false;
        if (filterStatus === "inactive" && isCurrentlyActive) return false;
      }

      // Plan Type Filter
      if (filterPlan !== "all" && student.planType !== filterPlan) return false;

      // Shift Filter
      if (filterShift !== "all" && normalizeShift(student.shift) !== normalizeShift(filterShift)) return false;

      // Expiry Filter
      if (filterExpiry !== "all") {
        const expDate = new Date(student.expiryDate);
        expDate.setHours(0, 0, 0, 0);

        if (filterExpiry === "expired") {
          if (expDate >= today) return false;
        } else if (filterExpiry === "today") {
          if (expDate.getTime() !== today.getTime()) return false;
        } else if (filterExpiry === "tomorrow") {
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          if (expDate.getTime() !== tomorrow.getTime()) return false;
        }
      }

      return true;
    });
  }, [students, searchName, filterStatus, filterPlan, filterShift, filterExpiry]);

  const sortedStudents = useMemo(() => {
    const studentCopy = [...filteredStudents];
    const compare = (a: StudentDetail, b: StudentDetail) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (sortKey === "startDate" || sortKey === "expiryDate") {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return sortOrder === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      return 0;
    };

    return studentCopy.sort(compare);
  }, [filteredStudents, sortKey, sortOrder]);

  const toggleSort = (key: keyof StudentDetail) => {
    if (sortKey === key) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    if (!slug) {
      setError("Library not found.");
      setLoading(false);
      return;
    }

    const storedToken = localStorage.getItem("token") || localStorage.getItem("app-auth");
    if (!storedToken) {
      router.push("/");
      return;
    }

    const token = storedToken;

    async function loadData() {
      try {
        setLoading(true);
        const apiController = new ApiDataController(token);
        const data = await apiController.GetApiWithToken(`${Constants.get_libraries_by_slug_url}${slug}`);

        const libraryData = data?.library || data;
        const studentData = data?.students || data?.library?.students || [];

        // Role check from token
        let userRole = "";
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userRole = payload.role;
        } catch (e) {}

        if (libraryData && !libraryData.isActive && userRole !== "super_admin") {
          setError("INACTIVE_BRANCH");
          setLoading(false);
          return;
        }

        setLibrary(libraryData);
        const todayStr = new Date().toDateString();
        setStudents(Array.isArray(studentData) ? studentData : []);
        const expiringTodayCount = studentData.filter((item: any) => new Date(item.expiryDate).toDateString() === todayStr).length;
        setExpiringToday(expiringTodayCount);
        console.log("studentData count:", expiringTodayCount, "Date:", todayStr);
        // Load stats immediately after library is identified
        const libId = libraryData?._id || libraryData?.id;
        if (libId) {
          try {
            const statsRes = await apiController.GetApiWithToken(`${Constants.monthly_stats_url}?libraryId=${libId}`);
            if (statsRes.stats && statsRes.stats.length > 0) {
              const now = new Date();
              const currentMonthStat = statsRes.stats.find((s: any) => s.month === (now.getMonth() + 1) && s.year === now.getFullYear());
              setStats(currentMonthStat || { totalRevenue: 0, studentsAdded: 0 });
            } else {
              setStats({ totalRevenue: 0, studentsAdded: 0 });
            }
          } catch (statErr) {
            console.error("Failed to load stats", statErr);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load library details.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  if (loading) {
    return <LibraryPageSkeleton />;
  }

  if (error === "INACTIVE_BRANCH") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-8 shadow-xl shadow-rose-100/50">
          <FiXCircle size={48} />
        </div>
        <div className="max-w-md text-center px-6">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Branch Locked</h1>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            Your library account for <span className="font-bold text-slate-900">{library?.name || "this branch"}</span> is currently inactive. Please contact our administration team to activate your subscription.
          </p>
          
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left space-y-4 mb-8">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                 <FiPhone size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Call Support</p>
                 <p className="text-sm font-bold text-slate-900">+91 99999 88888</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                 <FiMail size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Us</p>
                 <p className="text-sm font-bold text-slate-900">support@shikshaintel.com</p>
               </div>
            </div>
          </div>

          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (error || !library) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6">
          <FiXCircle size={32} />
        </div>
        <p className="text-slate-900 font-bold text-lg mb-2">{error || "Library details unavailable."}</p>
        <p className="text-slate-500 text-sm mb-6">We couldn't find the branch you're looking for.</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* HEADER & ACTIONS */}
      <div className={`${t.bgLight} border ${t.borderPrimary} rounded-2xl px-5 py-5 sm:px-7 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center shadow-md ${t.shadow} flex-shrink-0`}>
            <span className="text-white font-black text-lg">{library.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight capitalize">{library.name}</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{library?.address}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Link href="/dashboard" className={`inline-flex h-9 sm:h-10 items-center px-4 text-sm font-semibold text-slate-600 hover:${t.textPrimary} transition-colors`}>
            ← Back
          </Link>
          <button 
            onClick={() => setShowBulkUpload(true)}
            className={`inline-flex h-9 sm:h-10 items-center px-4 rounded-xl bg-white border ${t.borderPrimary} text-sm font-semibold text-slate-700 hover:${t.bgLight} transition-all shadow-sm`}
          >
            Bulk Upload
          </button>
          <Link href={`/dashboard/${slug}/add_student`} className={`inline-flex h-9 sm:h-10 items-center gap-2 px-5 rounded-xl bg-gradient-to-r ${t.gradient} text-sm font-semibold text-white hover:opacity-90 transition-all shadow-md ${t.shadow}`}>
            + Add Student
          </Link>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-4">
        <div className="bg-emerald-50 p-3 sm:p-5 rounded-2xl border border-emerald-100 shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center">
          <p className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Revenue</p>
          <p className="text-lg sm:text-2xl font-black text-emerald-900 mt-1">₹{(stats?.totalRevenue || 0).toLocaleString()}</p>
          <p className="text-[9px] sm:text-[11px] text-emerald-600 font-medium mt-1">This month</p>
        </div>

        <div className="bg-blue-50 p-3 sm:p-5 rounded-2xl border border-blue-100 shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center">
          <p className="text-[10px] sm:text-xs font-bold text-blue-700 uppercase tracking-wider">New Students</p>
          <p className="text-lg sm:text-2xl font-black text-blue-900 mt-1">+{stats?.studentsAdded || 0}</p>
          <p className="text-[9px] sm:text-[11px] text-blue-600 font-medium mt-1">Recently Added</p>
        </div>

        <div className={`${t.bgLight} p-3 sm:p-5 rounded-2xl border ${t.borderPrimary} shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center`}>
          <p className={`text-[10px] sm:text-xs font-bold ${t.textPrimary} uppercase tracking-wider`}>Occupancy</p>
          <p className={`text-lg sm:text-2xl font-black ${t.textPrimaryDark} mt-1`}>
            {library?.totalSeats ? Math.round((students.filter(s => s.isActive).length / library.totalSeats) * 100) : 0}%
          </p>
          <p className={`text-[9px] sm:text-[11px] ${t.textPrimary} font-medium mt-1`}>{students.filter(s => s.isActive).length} / {library?.totalSeats || 0} Seats</p>
        </div>

        <div className="bg-rose-50 p-3 sm:p-5 rounded-2xl border border-rose-100 shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center">
          <p className="text-[10px] sm:text-xs font-bold text-rose-700 uppercase tracking-wider leading-tight">Expiring<br className="sm:hidden" /> Today</p>
          <p className={`text-lg sm:text-2xl font-black mt-1 ${expiringToday > 0 ? 'text-rose-600' : 'text-rose-900'}`}>{expiringToday || 0}</p>
          <p className="text-[9px] sm:text-[11px] text-rose-600 font-medium mt-1">Requires Action</p>
        </div>
      </div>

      {/* Deactivation Confirmation Modal */}
      {studentToDeactivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Deactivate Student</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to deactivate <span className="font-semibold text-slate-800">{studentToDeactivate.name}</span>? They will lose active library access.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setStudentToDeactivate(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  executeStatusChange(studentToDeactivate);
                  setStudentToDeactivate(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-sm font-semibold text-white hover:bg-rose-500 shadow-sm transition-all"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <BulkUploadModal 
          show={showBulkUpload} 
          onClose={() => setShowBulkUpload(false)} 
          library={library} 
          onSuccess={() => {
             // Refresh data
             window.location.reload();
          }}
        />
      )}

      {/* Reactivation Confirmation Modal */}
      {studentToReactivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Reactivate Student</h3>
            <p className="text-sm text-slate-500 mb-5">
              You are about to reactivate <span className="font-semibold text-slate-800">{studentToReactivate.name}</span>. How would you like to handle their billing cycle?
            </p>

            <div className="mb-6 space-y-3">
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${reactivateCycleOption === 'same' ? `${t.borderPrimary} ${t.bgLight}/50` : 'border-slate-200 hover:bg-slate-50'}`}>
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    type="radio"
                    name="cycleOption"
                    checked={reactivateCycleOption === 'same'}
                    onChange={() => setReactivateCycleOption('same')}
                    className={`w-4 h-4 ${t.textPrimary} border-slate-300 focus:ring-${t.primary}-500`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Keep Same Cycle</p>
                  <p className="text-xs text-slate-500 mt-0.5">Continue from their previously established expiration dates.</p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${reactivateCycleOption === 'new' ? `${t.borderPrimary} ${t.bgLight}/50` : 'border-slate-200 hover:bg-slate-50'}`}>
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    type="radio"
                    name="cycleOption"
                    checked={reactivateCycleOption === 'new'}
                    onChange={() => setReactivateCycleOption('new')}
                    className={`w-4 h-4 ${t.textPrimary} border-slate-300 focus:ring-${t.primary}-500`}
                  />
                </div>
                <div className="w-full">
                  <p className="text-sm font-semibold text-slate-900">Start New Cycle</p>
                  <p className="text-xs text-slate-500 mt-0.5">Start a fresh, fully renewed billing cycle from today.</p>

                  {reactivateCycleOption === 'new' && (
                    <div className="mt-4 grid grid-cols-1 gap-3 w-full" onClick={(e) => e.stopPropagation()}>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="block text-xs font-semibold text-slate-600 mb-1 tracking-tight">Plan Type</span>
                          <select
                            value={newCycleData.planType}
                             onChange={(e) => setNewCycleData({ ...newCycleData, planType: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-indigo-500"
                          >
                            {availablePlanTypes.map(p => (
                              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                            ))}
                          </select>
                        </div>
                        <div className="hidden">
                          <span className="block text-xs font-semibold text-slate-600 mb-1 tracking-tight">Shift</span>
                          <select
                            value={newCycleData.shift}
                            onChange={(e) => setNewCycleData({ ...newCycleData, shift: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-indigo-500"
                          >
                            {availableShifts.map(s => (
                              <option key={s} value={s}>{s === 'fullDay' ? 'Full Day' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="w-full">
                          <span className="block text-xs font-semibold text-slate-600 mb-1 tracking-tight">Seat Allocation</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newCycleData.seatNumber ? `Seat #${newCycleData.seatNumber}` : ""}
                              readOnly
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none bg-slate-50 font-medium text-indigo-700"
                              placeholder="Browse map →"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSeatPopup(true)}
                              className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-all shrink-0"
                            >
                              <FiMonitor size={14} />
                              <span className="ml-1.5 hidden sm:inline">Map</span>
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <span className="block text-xs font-semibold text-slate-600 mb-1 tracking-tight">Locker Charges</span>
                            <div className="relative">
                              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">₹</span>
                              <input
                                type="number"
                                min="0"
                                value={newCycleData.lockerCharges}
                                onChange={(e) => setNewCycleData({ ...newCycleData, lockerCharges: e.target.value })}
                                className="w-full pl-6 pr-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-indigo-500"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <span className="block text-xs font-semibold text-slate-600 mb-1 tracking-tight">Discount</span>
                            <div className="relative">
                              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">₹</span>
                              <input
                                type="number"
                                min="0"
                                value={newCycleData.discount}
                                onChange={(e) => setNewCycleData({ ...newCycleData, discount: e.target.value })}
                                className="w-full pl-6 pr-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                        <span className="text-slate-500 uppercase tracking-wider font-bold">Estimated Final</span>
                        <span className="text-emerald-600 font-bold text-sm">₹{finalPrice}</span>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {reactivateCycleOption === "same" && occupiedSameCycle && (
              <div className="mb-6 rounded-2xl bg-rose-50 p-4 border border-rose-100 flex items-start gap-3">
                <div className="mt-0.5 text-rose-500">
                  <FiX size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-900">Seat Conflict</h4>
                  <p className="text-sm text-rose-700 mt-0.5">
                    Seat {studentToReactivate.seatNumber} is currently occupied by someone else for the {studentToReactivate.shift} shift. Please use <b>"Start New Cycle"</b> to pick a different seat.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStudentToReactivate(null)}
                className="flex-1 rounded-2xl border border-slate-200 py-3.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => executeStatusChange(studentToReactivate, reactivateCycleOption === "new")}
                disabled={(reactivateCycleOption === "same" && occupiedSameCycle) || (reactivateCycleOption === "new" && !newCycleData.seatNumber)}
                className={`flex-1 rounded-2xl py-3.5 text-sm font-semibold text-white shadow-lg transition-all ${
                  (reactivateCycleOption === "same" && occupiedSameCycle) || (reactivateCycleOption === "new" && !newCycleData.seatNumber)
                  ? 'bg-slate-300 cursor-not-allowed grayscale'
                  : 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300'
                  }`}
              >
                Confirm Reactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {studentToEdit && (
        <EditStudentModal
          student={studentToEdit}
          onClose={() => setStudentToEdit(null)}
          onSave={handleEditStudent}
        />
      )}

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <DeleteStudentModal
          student={studentToDelete}
          onClose={() => setStudentToDelete(null)}
          onConfirm={() => handleDeleteStudent(studentToDelete._id)}
        />
      )}

      {/* STUDENT ROSTER TABLE */}
      <div className="bg-violet-50  border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900">Active Roster</h2>
            
            <div className="relative w-full md:w-80">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search name, phone or seat..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-600 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 outline-none focus:border-indigo-600 shadow-sm"
             >
               <option value="all">All ({students.length})</option>
               <option value="active">Active ({students.filter(s => s.isActive).length})</option>
               <option value="inactive">Inactive ({students.filter(s => !s.isActive).length})</option>
             </select>

             <select 
               value={filterPlan}
               onChange={(e) => setFilterPlan(e.target.value)}
               className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 outline-none focus:border-indigo-600 shadow-sm capitalize"
             >
               <option value="all">All Plans</option>
               {availablePlanTypes.map(p => <option key={p} value={p}>{p}</option>)}
             </select>

             <select 
               value={filterShift}
               onChange={(e) => setFilterShift(e.target.value)}
               className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 outline-none focus:border-indigo-600 shadow-sm capitalize"
             >
               <option value="all">All Shifts</option>
               {availableShifts.map(s => <option key={s} value={s}>{s === 'fullDay' ? 'Full Day' : s}</option>)}
             </select>

             <select 
               value={filterExpiry}
               onChange={(e) => setFilterExpiry(e.target.value)}
               className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 outline-none focus:border-indigo-600 shadow-sm"
             >
               <option value="all">Any Elapse</option>
               <option value="expired">Already Expired</option>
               <option value="today">Expiring Today</option>
               <option value="tomorrow">Expiring Tomorrow</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                 <th className="px-4 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600" onClick={() => toggleSort("name")}>
                 Si No.
                </th>
                <th className="px-6 py-4 w-10">
                   <input 
                     type="checkbox" 
                     checked={sortedStudents.length > 0 && selectedIds.length === sortedStudents.map(s => s._id || (s as any).id).filter(Boolean).length}
                     onChange={() => handleSelectAll(sortedStudents)}
                     className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                   />
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600" onClick={() => toggleSort("name")}>
                  Student {sortKey === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider text-center">Seat / Plan</th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600" onClick={() => toggleSort("expiryDate")}>
                  Expiry Date {sortKey === "expiryDate" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {sortedStudents.length === 0 ?
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                    No students found matching your filters.
                  </td>
                </tr>
              :
                sortedStudents.map((student, idx) => {
                  const studentId = student._id || (student as any).id;
                  const isSelected = selectedIds.includes(studentId);
                  const rowBg = isSelected
                    ? 'bg-indigo-50/50'
                    : idx % 2 === 0
                    ? 'bg-white'
                    : 'bg-violet-50/30';
                  return (
                    <tr key={studentId} className={`hover:bg-violet-50/50 transition-colors ${rowBg}`}>
                      <td className="px-2 py-4 text-center">
                        <span className="text-xs font-bold text-slate-400">{idx + 1}</span>
                      </td>
                      <td className="px-6 py-4">
                         <input 
                           type="checkbox" 
                           checked={selectedIds.includes(studentId)}
                           onChange={() => toggleSelect(studentId)}
                           className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                         />
                      </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          {/* <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                             {student.name.charAt(0)}
                          </div> */}
                          <div>
                             <p className="font-bold text-slate-900">{student.name}</p>
                             <p className="text-xs text-slate-500">{student.phone}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center justify-center gap-4 text-center">
                          <div>
                             <p className="text-sm font-bold text-indigo-600">#{student.seatNumber}</p>
                             <p className="text-[10px] text-slate-400 uppercase">Seat</p>
                          </div>
                          <div className="h-4 w-px bg-slate-200"></div>
                          <div>
                             <p className="text-sm font-bold text-slate-900 capitalize">{student.planType}</p>
                             <p className="text-[10px] text-slate-400 uppercase">{student.shift === 'fullDay' ? 'Full Day' : student.shift}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
  <span
    className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
      student.isActive
        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
        : "bg-slate-50 text-slate-500 border-slate-200"
    }`}
  >
    {student.isActive ? "Active" : "Inactive"}
  </span>

  <button
    onClick={() => handleToggleStatus(student)}
    disabled={togglingId === student._id}
    className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${
      student.isActive ? "bg-indigo-600" : "bg-slate-300"
    } ${togglingId === student._id ? "opacity-50" : ""}`}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
        student.isActive ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
</div>
                    </td>
                    <td className="px-6 py-4">
                       <div>
                          <p className={`text-sm font-bold ${new Date(student.expiryDate) < new Date() ? 'text-rose-600' : 'text-slate-900'}`}>
                             {new Date(student.expiryDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">Starts: {new Date(student.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} · ₹{student.finalPrice}</p>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleSendManualReminder(student)} disabled={sendingReminderId === student._id} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="WhatsApp Reminder">
                            {sendingReminderId === student._id ? <FiClock className="animate-spin" /> : <FaWhatsapp size={16} />}
                          </button>
                          <button onClick={() => setStudentToEdit(student)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors" title="Edit">
                            <FiEdit size={16} />
                          </button>
                          <button onClick={() => setStudentToDelete(student)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors" title="Delete">
                            <FiTrash2 size={16} />
                          </button>
                       </div>
                    </td>
                   </tr>
                  )
                })
              }
              </tbody>
            </table>
          </div>
        </div>
      {/* Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-4 duration-300 min-w-[320px]">
          {isDeleting ? (
            <div className="w-full space-y-2">
               <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                  <span>Deleting Students...</span>
                  <span>{deleteProgress.current} / {deleteProgress.total}</span>
               </div>
               <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 transition-all duration-300" 
                    style={{ width: `${(deleteProgress.current / deleteProgress.total) * 100}%` }}
                  ></div>
               </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 pr-4 border-r border-slate-700">
                 <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-[11px] font-bold">
                   {selectedIds.length}
                 </span>
                 <span className="text-sm font-semibold">Selected</span>
              </div>
              
              <div className="flex items-center gap-4">
                 <button 
                   onClick={handleBulkExport}
                   className="flex items-center gap-2 text-sm font-semibold hover:text-indigo-400 transition-colors"
                 >
                   <FiDownload size={16} />
                   Export CSV
                 </button>
                 <button 
                   onClick={()=>handleBulkDelete()}
                   className="flex items-center gap-2 text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                 >
                   <FiTrash2 size={16} />
                   Bulk Delete
                 </button>
                 <button 
                   onClick={() => setSelectedIds([])}
                   className="ml-2 p-1 hover:bg-slate-800 rounded-lg transition-colors"
                   title="Clear Selection"
                 >
                   <FiX size={16} />
                 </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Seat Selection Modal */}
      <SeatMapModal
        show={showSeatPopup}
        onClose={() => setShowSeatPopup(false)}
        seatStates={seatStates}
        newCycleData={newCycleData}
        setNewCycleData={setNewCycleData}
        fullAvailableCount={fullAvailableCount}
        halfAvailableCount={halfAvailableCount}
        totalSeats={library?.totalSeats ?? 0}
      />
    </div>
  );
}

// Seat Selection Modal Component
function SeatMapModal({
  show,
  onClose,
  seatStates,
  newCycleData,
  setNewCycleData,
  fullAvailableCount,
  halfAvailableCount,
  totalSeats
}: any) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex w-full max-w-5xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Seat Allocation</h2>
            <p className="text-xs text-slate-500 mt-1">Select a seat and shift from the live map.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8">

          {/* Legend & Stats */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-emerald-500"></span><span className="text-xs font-semibold text-slate-600">Available</span></div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-rose-500"></span><span className="text-xs font-semibold text-slate-600">Occupied</span></div>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-slate-700">
               <span>Full Day: {fullAvailableCount}</span>
               <span>Half Day: {halfAvailableCount}</span>
               <span className="bg-slate-900 text-white px-2 py-1 rounded">Total: {totalSeats}</span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {seatStates.map((seat: any) => {
              const isSelected = String(seat.seatNumber) === newCycleData.seatNumber;
              
              return (
                <div key={seat.seatNumber} className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${isSelected ? "border-indigo-600 bg-indigo-50 shadow-sm" : "border-slate-100 bg-white"}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                    {seat.seatNumber}
                  </div>

                  <div className="w-full flex flex-col gap-1">
                    {seat.takenFullDay ? (
                      <div className="w-full py-1 text-center text-[10px] font-bold text-rose-500 bg-rose-50 rounded">Booked</div>
                    ) : (
                      <>
                        {!seat.takenMorning && !seat.takenEvening && (
                          <button
                            type="button"
                            onClick={() => { setNewCycleData({ ...newCycleData, shift: "fullDay", seatNumber: String(seat.seatNumber) }); onClose(); }}
                            className="w-full py-1 text-[9px] font-bold text-indigo-600 border border-indigo-100 rounded hover:bg-indigo-600 hover:text-white transition-colors"
                          >
                            Full Day
                          </button>
                        )}
                        {!seat.takenMorning ? (
                           <button onClick={() => { setNewCycleData({ ...newCycleData, shift: "morning", seatNumber: String(seat.seatNumber) }); onClose(); }} className="w-full py-1 text-[9px] font-bold text-emerald-600 border border-emerald-100 rounded hover:bg-emerald-600 hover:text-white transition-colors">Morning</button>
                        ) : (
                           <div className="w-full py-1 text-center text-[9px] font-bold text-rose-400 bg-rose-50 rounded italic">M-Taken</div>
                        )}
                        {!seat.takenEvening ? (
                           <button onClick={() => { setNewCycleData({ ...newCycleData, shift: "evening", seatNumber: String(seat.seatNumber) }); onClose(); }} className="w-full py-1 text-[9px] font-bold text-emerald-600 border border-emerald-100 rounded hover:bg-emerald-600 hover:text-white transition-colors">Evening</button>
                        ) : (
                           <div className="w-full py-1 text-center text-[9px] font-bold text-rose-400 bg-rose-50 rounded italic">E-Taken</div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit Student Modal Component
function EditStudentModal({ student, onClose, onSave }: {
  student: StudentDetail;
  onClose: () => void;
  onSave: (id: string, updates: Partial<StudentDetail>) => Promise<void>;
}) {
  const [formData, setFormData] = useState({
    name: student.name,
    email: student.email || "",
    phone: student.phone
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(student._id, formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="mb-6 flex items-center justify-between">
          <div>
             <h3 className="text-xl font-bold text-slate-900">Edit Profile</h3>
             <p className="text-xs text-slate-500 mt-1">Update student member details</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors">
            <FiX size={18} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 ml-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 ml-1">Phone Number</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 ml-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
              placeholder="member@example.com"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-all shadow-indigo-100"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Student Modal Component
function DeleteStudentModal({ student, onClose, onConfirm }: {
  student: StudentDetail;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl border border-slate-100 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-6 mx-auto">
           <FiTrash2 size={24} />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Member?</h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Removing <span className="font-semibold text-slate-900">{student.name}</span> will erase all active sessions and history. This action cannot be undone.
        </p>

        <div className="flex flex-col gap-2">
           <button
             onClick={onConfirm}
             className="w-full py-3 rounded-xl bg-rose-600 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition-all"
           >
             Delete Permanently
           </button>
           <button
             onClick={onClose}
             className="w-full py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
           >
             Cancel
           </button>
        </div>
      </div>
    </div>
  );
}
