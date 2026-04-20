import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Search, MapPin, ChevronRight, ChevronDown, CalendarDays,
  CheckCircle2, X, TrendingUp, Printer, Minus, AlertTriangle,
  Users, Activity, Tent,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

export default function Camps() {
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [open, setOpen] = useState(false);
  const [expandedMeds, setExpandedMeds] = useState({});
  const [reportModal, setReportModal] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const up = await API.get("/camps/upcoming");
      const comp = await API.get("/camps/completed");
      setUpcoming(up.data.data || []);
      setCompleted(comp.data.data || []);
    } catch (err) { console.error(err); }
  };

  const toggleMeds = (id) => setExpandedMeds((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleViewReport = async (campId) => {
    setReportLoading(true);
    setReportError("");
    setReportModal(null);
    try {
      const res = await API.get(`/reports/camp/${campId}`);
      const reports = res.data.data || [];
      if (!reports.length) setReportError("No report found for this camp.");
      else setReportModal(reports[0]);
    } catch (err) {
      setReportError(err.response?.data?.message || "Failed to load report");
    } finally { setReportLoading(false); }
  };

  const closeModal = () => { setReportModal(null); setReportError(""); };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="lg:ml-64">
        <Topbar title="Camps" setOpen={setOpen} />

        <div className="p-6 space-y-6 max-w-screen-xl mx-auto">

          {/* UPCOMING */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-800">Upcoming Camps</h2>
              <span className="text-xs bg-blue-50 text-blue-600 font-medium border border-blue-100 px-2.5 py-1 rounded-full">
                {upcoming.length} scheduled
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* TABLE HEADER */}
              <div className="grid grid-cols-[1fr_auto_auto] border-b border-slate-100 bg-slate-50">
                <div className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-100">Camp</div>
                <div className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-100 min-w-[180px]">Date</div>
                <div className="px-5 py-3 min-w-[160px]" />
              </div>

              {upcoming.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Tent className="w-8 h-8 mb-2 text-slate-300" />
                  <p className="text-sm">No upcoming camps scheduled</p>
                </div>
              ) : (
                upcoming.map((camp) => {
                  const medCount = camp.medicines?.length || 0;
                  const isOpen = expandedMeds[camp._id];
                  return (
                    <div key={camp._id}>
                      <div className="grid grid-cols-[1fr_auto_auto] border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                        <div className="px-5 py-4 border-r border-slate-100">
                          <p className="text-sm font-semibold text-slate-800">{camp.nameOfCamp}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-red-400" /> {camp.location}
                          </p>
                        </div>
                        <div className="px-5 py-4 border-r border-slate-100 min-w-[180px] flex items-center">
                          <span className="text-sm text-slate-600">
                            {new Date(camp.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <div className="px-5 py-4 min-w-[160px] flex items-center justify-end">
                          {medCount > 0 && (
                            <button
                              onClick={() => toggleMeds(camp._id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm text-slate-700 font-medium transition-colors"
                            >
                              {medCount} Medicines
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            </button>
                          )}
                        </div>
                      </div>
                      {isOpen && (
                        <div className="px-5 py-3 bg-blue-50/40 border-b border-slate-100 flex flex-wrap gap-2">
                          {camp.medicines.map((m, i) => (
                            <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white border border-blue-100 text-blue-700 text-xs font-medium shadow-sm">
                              {m.medicine?.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* COMPLETED */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-800">Completed Camps</h2>
              <span className="text-xs bg-emerald-50 text-emerald-600 font-medium border border-emerald-100 px-2.5 py-1 rounded-full">
                {completed.length} completed
              </span>
            </div>

            {completed.length === 0 ? (
              <div className="text-center py-12 border border-slate-200 rounded-2xl bg-white">
                <p className="text-sm text-slate-400">No completed camps yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.map((camp) => (
                  <CompletedCard key={camp._id} camp={camp} onViewReport={() => handleViewReport(camp._id)} />
                ))}
              </div>
            )}
          </section>

          {/* REPORTS HINT */}
          <section>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Reports</h3>
              <p className="text-xs text-slate-400">Click "View Report" on any completed camp to see its detailed performance report.</p>
            </div>
          </section>
        </div>
      </div>

      {/* LOADING */}
      {reportLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3 shadow-2xl">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-600 font-medium">Loading report…</p>
          </div>
        </div>
      )}

      {/* ERROR */}
      {reportError && !reportLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl space-y-4">
            <p className="text-sm text-red-600 font-medium text-center">{reportError}</p>
            <button onClick={closeModal} className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm text-slate-700 font-medium">
              Close
            </button>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {reportModal && !reportLoading && (
        <ReportModal report={reportModal} onClose={closeModal} />
      )}
    </div>
  );
}

function CompletedCard({ camp, onViewReport }) {
  const medCount = camp.medicines?.length || 0;
  return (
    <div className="rounded-2xl border border-slate-200 p-5 bg-white hover:shadow-md transition-all space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-800 truncate">{camp.nameOfCamp}</h4>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-red-400 shrink-0" /> {camp.location}
          </p>
          <p className="text-xs text-slate-400 mt-1">{new Date(camp.date).toDateString()}</p>
        </div>
        <button
          onClick={onViewReport}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
        >
          Report <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
        </span>
        {medCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <CalendarDays className="w-3 h-3" /> {medCount} medicines
          </span>
        )}
      </div>
    </div>
  );
}

function ReportModal({ report, onClose }) {
  const successRate = report.successRate ?? 0;
  const meds = report.medicinesDistributed || [];
  const doctorNotes = report.doctorReport || "";
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (successRate / 100) * circumference;
  const performanceLabel =
    successRate >= 85 ? "Excellent" :
    successRate >= 70 ? "Good" :
    successRate >= 50 ? "Average" : "Needs Improvement";
  const performanceColor =
    successRate >= 85 ? "#22c55e" :
    successRate >= 70 ? "#3b82f6" :
    successRate >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-slate-800">Camp Performance Report</h2>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Printer className="w-4 h-4" /></button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* CAMP INFO */}
          <div>
            <h3 className="text-lg font-bold text-slate-900">{report.campName}</h3>
            <div className="mt-2 space-y-1 text-sm text-slate-500">
              <p><span className="text-slate-400">Location: </span>{report.location}</p>
              {report.doctor && <p><span className="text-slate-400">Doctor: </span>{report.doctor?.name || "—"}</p>}
              <p>
                <span className="text-slate-400">Date: </span>
                {new Date(report.camp?.date || report.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* DONUT */}
          <div className="bg-slate-50 rounded-xl p-5 flex flex-col items-center">
            <p className="text-xs font-semibold text-slate-600 mb-4">Success Rate</p>
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={performanceColor} strokeWidth="12"
                  strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-800">{successRate}%</span>
                <span className="text-[10px] text-slate-500 text-center leading-tight px-2">{performanceLabel}</span>
              </div>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" /> Statistics
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Total:</span><span className="font-bold text-slate-700">{report.totalPeople}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Minor:</span><span className="font-bold text-emerald-600">{report.minorCases}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Major:</span><span className="font-bold text-red-500">{report.majorCases}</span></div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-violet-500" /> Key Insights
              </p>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-6">{doctorNotes || "No notes provided."}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <p className="text-[11px] font-semibold text-slate-600">Medicines Used</p>
              {meds.length === 0 ? (
                <p className="text-xs text-slate-400">None recorded</p>
              ) : (
                <div className="space-y-1.5">
                  {meds.map((m, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span className="text-xs text-slate-500">{m.medicine?.name || "Unknown"} - {m.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ALERT */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-700 mr-1">Alert:</span>
              {report.majorCases > report.minorCases
                ? "High number of major cases — consider additional medical resources for future camps."
                : meds.length > 0
                ? "Monitor medicine stock levels to avoid shortages in future camps."
                : "No critical alerts for this camp."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}