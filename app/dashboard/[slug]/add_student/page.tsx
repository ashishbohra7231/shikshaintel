"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { FiSave, FiUser, FiMonitor, FiX, FiRefreshCw, FiArrowRight } from "react-icons/fi";
import ApiDataController from "@/controllers/masters";
import { Constants } from "@/constants/Constants";

interface LibraryPricing {
  half_day: { monthly: number; quarterly: number; yearly: number };
  full_day: { monthly: number; quarterly: number; yearly: number };
}

interface LibraryStudent {
  seatNumber: number;
  shift: string;
  isActive?: boolean;
}

interface LibraryDetail {
  _id?: string;
  name: string;
  totalSeats?: number;
  pricing?: LibraryPricing;
  shifts?: {
    morning?: { start: string; end: string };
    evening?: { start: string; end: string };
    fullDay?: { start: string; end: string };
  };
  students?: LibraryStudent[];
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

        <div className="flex-1 overflow-y-auto p-8">
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

export default function AddStudentPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const router = useRouter();

  const [library, setLibrary] = useState<LibraryDetail | null>(null);
  const [students, setStudents] = useState<LibraryStudent[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [planType, setPlanType] = useState("monthly");
  const [shift, setShift] = useState("morning");
  const [discount, setDiscount] = useState("0");
  const [lockerCharges, setLockerCharges] = useState("0");
  const [showSeatPopup, setShowSeatPopup] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState("");
  const [useManualExpiry, setUseManualExpiry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
    if (!token) {
      router.push("/");
      return;
    }
    const apiController = new ApiDataController(token);
    async function loadLibrary() {
      try {
        const response = await apiController.GetApiWithToken(`${Constants.get_libraries_by_slug_url}${slug}`);
        const libraryData = response?.library || response;
        const studentData = response?.students || response?.library?.students || libraryData?.students || [];
        setLibrary(libraryData);
        setStudents(Array.isArray(studentData) ? studentData : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load library pricing details.");
      }
    }
    loadLibrary();
  }, [slug]);

  const originalPrice = useMemo(() => priceForPlan(library, shift, planType), [library, shift, planType]);
  const finalPrice = Math.max(0, originalPrice - Math.max(0, Number(discount || 0)) + Math.max(0, Number(lockerCharges || 0)));

  const availablePlanTypes = useMemo(() => {
    if (!library?.pricing) return ["monthly", "quarterly", "yearly"];
    return Object.keys(library.pricing.half_day) as string[];
  }, [library]);

  const normalizeShift = (rawShift: string | undefined) => {
    if (!rawShift) return "";
    return rawShift.toString().trim().toLowerCase().replace(/[_\s-]+/g, "").replace(/fullday/, "fullday");
  };

  const seatStates = useMemo(() => {
    if (!library?.totalSeats) return [] as SeatState[];
    const allStudents = Array.isArray(students) ? students : [];

    return Array.from({ length: library.totalSeats }, (_, index) => {
      const seatNumber = index + 1;
      const seatStudents = allStudents.filter((student) => 
        student.isActive !== false && Number(student?.seatNumber) === seatNumber
      );
      const takenMorning = seatStudents.some((student) => normalizeShift(student?.shift) === "morning");
      const takenEvening = seatStudents.some((student) => normalizeShift(student?.shift) === "evening");
      const takenFullDay = seatStudents.some((student) => normalizeShift(student?.shift) === "fullday");

      return { seatNumber, takenMorning, takenEvening, takenFullDay };
    });
  }, [library, students]);

  const availableShifts = useMemo(() => {
    if (!library?.shifts) return ["morning", "evening", "fullDay"];
    return Object.keys(library.shifts) as string[];
  }, [library]);

  const currentShift = normalizeShift(shift);

  const seatUnavailable = (seat: SeatState) => {
    if (seat.takenFullDay) return true;
    if (currentShift === "morning") return seat.takenMorning;
    if (currentShift === "evening") return seat.takenEvening;
    if (currentShift === "fullday") return seat.takenMorning || seat.takenEvening;
    return false;
  };

  useEffect(() => {
    if (!seatNumber) return;
    const chosenSeat = seatStates.find((seat) => String(seat.seatNumber) === seatNumber);
    if (chosenSeat && seatUnavailable(chosenSeat)) {
      setSeatNumber("");
    }
  }, [shift, seatNumber, seatStates]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!slug) return setError("Library slug is required.");
    const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
    if (!token) return setError("Session expired. Please login again.");

    setLoading(true);
    try {
      const apiController = new ApiDataController(token);
      const payload = { 
        libraryId: library?._id, 
        name, phone, email, 
        seatNumber: Number(seatNumber), 
        planType, originalPrice,
        discount: Math.max(0, Number(discount) || 0),
        lockerCharges: Math.max(0, Number(lockerCharges) || 0),
        shift,
        startDate,
        ...(useManualExpiry && { expiryDate })
      };
      await apiController.PostApiWithToken(Constants.add_student_url, payload);
      setSuccess(true);
      setTimeout(() => router.push(`/dashboard/${slug}`), 3000);
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please check occupancy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-violet-50 border border-violet-100 rounded-2xl p-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">New Student Enrollment</h1>
          <p className="text-sm text-slate-500 mt-1">Register a new student for {library?.name || "Library"}.</p>
        </div>
        <Link href={`/dashboard/${slug}`} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
          Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid items-start gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-8 pb-3 border-b border-slate-100">Student Identity</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+91 00000 00000"
                  className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 transition-all"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="john@example.com"
                  className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Configuration Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-8 pb-3 border-b border-slate-100">Subscription Plan</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Billing Cycle</label>
                <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-600 transition-all capitalize"
                >
                  {availablePlanTypes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Library Shift</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-600 transition-all capitalize"
                >
                  {availableShifts.map((s) => (
                    <option key={s} value={s}>{s === "fullDay" ? "Full Day" : s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Enrollment Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-semibold text-slate-700">Expiry Date</label>
                  <button 
                    type="button"
                    onClick={() => setUseManualExpiry(!useManualExpiry)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${useManualExpiry ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {useManualExpiry ? "Manual" : "Auto"}
                  </button>
                </div>
                {useManualExpiry ? (
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required={useManualExpiry}
                    className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 transition-all"
                  />
                ) : (
                  <div className="w-full h-11 px-4 rounded-lg bg-slate-50 border border-slate-100 flex items-center text-sm font-medium text-slate-400 italic">
                    Calculated from plan...
                  </div>
                )}
              </div>
              <div className="sm:col-span-2">
                 <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Seat Assignment</p>
                          <h3 className="text-lg font-bold text-slate-900">
                             {seatNumber ? `Confimed: Seat #${seatNumber}` : "Not Selected"}
                          </h3>
                       </div>
                       <button
                         type="button"
                         onClick={() => setShowSeatPopup(true)}
                         className="h-11 px-6 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                       >
                         <FiMonitor size={16} />
                         Browse Live Map
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY PANEL */}
        <aside className="space-y-6 lg:sticky lg:top-20">
          <div className="  border border-slate-200 rounded-2xl p-8 shadow-sm bg-violet-50">
            <h2 className="text-lg font-bold text-slate-900 mb-8 pb-3 border-b border-slate-100">Enrollment Summary</h2>
            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Base Rate</p>
                    <p className="text-lg font-bold text-slate-900">₹{originalPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tax/Fees</p>
                    <p className="text-xs font-semibold text-emerald-600 uppercase">Inclusive</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Locker Charges (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={lockerCharges}
                      onChange={(e) => setLockerCharges(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-600 transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Apply Discount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-600 transition-all"
                    />
                 </div>
               </div>
               <div className="pt-6">
                  <div className="p-6 rounded-xl bg-indigo-600 text-center text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">Total Payable</p>
                    <p className="text-3xl font-bold">₹{finalPrice}</p>
                  </div>
               </div>
               <button
                  type="submit"
                  disabled={loading || originalPrice <= 0 || !seatNumber}
                  className="w-full h-12 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
                >
                  {loading ? ( <FiRefreshCw className="w-4 h-4 animate-spin" /> ) : (
                    <>
                      Register Student
                      <FiArrowRight size={16} />
                    </>
                  )}
               </button>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
             <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-600 shrink-0 border border-slate-100 shadow-sm">
                <FiMonitor size={20} />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-900 uppercase">Availability</p>
                <p className="text-xs text-slate-500 mt-1">
                   {fullAvailableCount} Full / {halfAvailableCount} Half slots unallocated.
                </p>
             </div>
          </div>
        </aside>
      </form>

      {/* MODAL & TOASTS */}
      <SeatMapModal
        show={showSeatPopup}
        onClose={() => setShowSeatPopup(false)}
        seatStates={seatStates}
        newCycleData={{ seatNumber, shift }}
        setNewCycleData={(data: any) => {
           setSeatNumber(data.seatNumber);
           setShift(data.shift);
        }}
        fullAvailableCount={fullAvailableCount}
        halfAvailableCount={halfAvailableCount}
        totalSeats={library?.totalSeats ?? 0}
      />
      {success && (
        <div className="fixed bottom-8 right-8 z-[200] animate-in slide-in-from-right-10 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
           <p className="text-sm font-bold">Successfully Registered. Redirecting...</p>
        </div>
      )}
      {error && (
        <div className="fixed bottom-8 right-8 z-[200] animate-in slide-in-from-right-10 bg-rose-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
           <FiX size={18} />
           <p className="text-sm font-bold">{error}</p>
        </div>
      )}
    </div>
  );
}
