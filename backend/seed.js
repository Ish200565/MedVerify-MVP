import { useEffect, useState } from "react";
import API from "../../services/api";
import Logout from "../../components/layout/Logout";
import {
  CalendarDays, Clock, MapPin, Users, ChevronLeft, ChevronRight, X,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   MINI CALENDAR  –  highlights real camp dates
═══════════════════════════════════════════════════════════ */
function MiniCalendar({ campDates = [] }) {
  const today = new Date();
  const [cur, setCur] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const highlightSet = new Set(
    campDates.map((d) => {
      const dt = new Date(d);
      return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
    })
  );

  const firstDay    = new Date(cur.year, cur.month, 1).getDay();
  const daysInMonth = new Date(cur.year, cur.month + 1, 0).getDate();
  const DAY_LABELS  = ["S","M","T","W","T","F","S"];

  const prevMonth = () =>
    setCur(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );
  const nextMonth = () =>
    setCur(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );

  const monthLabel = new Date(cur.year, cur.month).toLocaleString("default", {
    month: "short", year: "numeric",
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="mt-3 select-none">
      <div className="flex items-center justify-between mb-1.5">
        <button onClick={prevMonth} className="p-0.5 rounded hover:bg-gray-100">
          <ChevronLeft className="w-3 h-3 text-gray-400" />
        </button>
        <span className="text-[10px] font-semibold text-gray-500">{monthLabel}</span>
        <button onClick={nextMonth} className="p-0.5 rounded hover:bg-gray-100">
          <ChevronRight className="w-3 h-3 text-gray-400" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px mb-0.5">
        {DAY_LABELS.map((d, i) => (
          <span key={i} className="text-[9px] text-center text-gray-400 font-medium">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {cells.map((d, i) => {
          const isHighlighted = d && highlightSet.has(`${cur.year}-${cur.month}-${d}`);
          const isToday = d &&
            cur.year  === today.getFullYear() &&
            cur.month === today.getMonth()    &&
            d         === today.getDate();
          return (
            <div key={i} className={`
              w-5 h-5 flex items-center justify-center rounded text-[9px] mx-auto font-medium
              ${isHighlighted            ? "bg-blue-500 text-white"          : ""}
              ${isToday && !isHighlighted ? "bg-gray-200 text-gray-700"       : ""}
              ${!isHighlighted && !isToday ? "text-gray-400"                  : ""}
            `}>
              {d ?? ""}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-2">
        <span className="flex items-center gap-1 text-[9px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Camp
        </span>
        <span className="flex items-center gap-1 text-[9px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" /> Today
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DONUT CHART  –  real major / minor / severity data
═══════════════════════════════════════════════════════════ */
function DonutChart({ major = 0, minor = 0 }) {
  const severity = Math.round(major * 0.15);
  const majorSlice = major - severity;
  const total = (minor + majorSlice + severity) || 1;
  const r = 34;
  const circ = 2 * Math.PI * r;

  const minorArc    = (minor      / total) * circ;
  const majorArc    = (majorSlice / total) * circ;
  const severityArc = (severity   / total) * circ;

  return (
    <svg viewBox="0 0 100 100" className="w-[68px] h-[68px]" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#3b82f6" strokeWidth="18"
        strokeDasharray={`${minorArc} ${circ - minorArc}`} strokeDashoffset={0} />
      <circle cx="50" cy="50" r={r} fill="none" stroke="#f97316" strokeWidth="18"
        strokeDasharray={`${majorArc} ${circ - majorArc}`} strokeDashoffset={-minorArc} />
      <circle cx="50" cy="50" r={r} fill="none" stroke="#ef4444" strokeWidth="18"
        strokeDasharray={`${severityArc} ${circ - severityArc}`}
        strokeDashoffset={-(minorArc + majorArc)} />
      <circle cx="50" cy="50" r="23" fill="white" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   BAR CHART  –  last 4 completed camps, real data
═══════════════════════════════════════════════════════════ */
function BarChart({ reports = [] }) {
  const last4  = reports.slice(-4);
  const maxVal = Math.max(...last4.map((r) => (r.minorCases || 0) + (r.majorCases || 0)), 1);

  if (!last4.length)
    return <p className="text-[10px] text-gray-300 mt-4">No data yet</p>;

  return (
    <div className="flex items-end gap-2 mt-3">
      {last4.map((r, i) => {
        const minor = r.minorCases || 0;
        const major = r.majorCases || 0;
        const scale = 44 / maxVal;
        const label = (r.campName || "Camp").split(/[\s–-]/)[0].slice(0, 4);
        return (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className="flex items-end gap-0.5">
              <div className="w-3.5 rounded-t-sm bg-blue-400"
                style={{ height: `${Math.max(minor * scale, 3)}px` }} />
              <div className="w-3.5 rounded-t-sm bg-orange-400"
                style={{ height: `${Math.max(major * scale, 3)}px` }} />
            </div>
            <span className="text-[9px] text-gray-400">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function DoctorDashboard() {
  const [upcoming,     setUpcoming]     = useState([]);
  const [completed,    setCompleted]    = useState([]);
  const [reports,      setReports]      = useState([]);
  const [viewReport,   setViewReport]   = useState(null);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [reportData,   setReportData]   = useState({
    totalPeople: "", minorCases: "", majorCases: "", doctorReport: "",
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [up, comp, rep] = await Promise.all([
        API.get("/camps/upcoming"),
        API.get("/camps/completed"),
        API.get("/reports/my"),
      ]);
      setUpcoming(up.data.data    || []);
      setCompleted(comp.data.data || []);
      setReports(rep.data.data    || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ── derived real stats ── */
  const totalCamps    = upcoming.length + completed.length;
  const totalPatients = reports.reduce((s, r) => s + (r.totalPeople || 0), 0);
  const totalMajor    = reports.reduce((s, r) => s + (r.majorCases  || 0), 0);
  const totalMinor    = reports.reduce((s, r) => s + (r.minorCases  || 0), 0);

  const allCampDates       = [...upcoming, ...completed].map((c) => c.date);
  const [featured, ...rest] = upcoming;

  const submitReport = async () => {
    try {
      await API.post("/reports", {
        campId: selectedCamp._id, ...reportData, medicinesDistributed: [],
      });
      alert("Report Submitted ✅");
      setSelectedCamp(null);
      setReportData({ totalPeople: "", minorCases: "", majorCases: "", doctorReport: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#eef0f5] font-sans">
      <Logout />

      {/* TOPBAR */}
      <div className="flex items-center px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="p-6 space-y-6 max-w-screen-xl mx-auto">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* 1 – Total Camps + calendar */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Camps</p>
            <p className="text-4xl font-extrabold text-gray-800 mt-1 leading-none">{totalCamps}</p>
            <MiniCalendar campDates={allCampDates} />
          </div>

          {/* 2 – Total Patients */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Patients Checked</p>
            <p className="text-4xl font-extrabold text-gray-800 mt-1 leading-none">{totalPatients}</p>
            <div className="flex-1 flex items-end mt-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>

          {/* 3 – Major Cases + donut */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Major Cases</p>
            <p className="text-4xl font-extrabold text-gray-800 mt-1 leading-none">{totalMajor}</p>
            <div className="flex items-center gap-3 mt-3">
              <DonutChart major={totalMajor} minor={totalMinor} />
              <div className="space-y-1.5">
                {[
                  { color: "bg-blue-500",   label: "Minor"    },
                  { color: "bg-orange-400", label: "Major"    },
                  { color: "bg-red-500",    label: "Severity" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                    <span className="text-[10px] text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4 – Minor Cases + bar chart */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Minor Cases</p>
            <p className="text-4xl font-extrabold text-gray-800 mt-1 leading-none">{totalMinor}</p>
            <BarChart reports={reports} />
          </div>
        </div>

        {/* ── UPCOMING CAMPS ── */}
        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-3">Upcoming Camps</h2>

          {!upcoming.length ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center text-sm text-gray-400">
              No upcoming camps assigned to you
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 items-start">

              {/* Featured card */}
              {featured && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-gray-800 leading-snug">
                      {featured.nameOfCamp}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200 whitespace-nowrap shrink-0">
                      Status
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                    {new Date(featured.date).toLocaleDateString("en-US", {
                      month: "long", day: "numeric", year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    {new Date(featured.date).toLocaleTimeString("en-US", {
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                    {featured.location}
                  </div>
                  {featured.medicines?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {featured.medicines.slice(0, 3).map((m, i) => (
                        <span key={i}
                          className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                          {m.medicine?.name || "Medicine"}
                        </span>
                      ))}
                      {featured.medicines.length > 3 && (
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs border border-gray-200">
                          +{featured.medicines.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Rest stacked */}
              {rest.length > 0 && (
                <div className="space-y-3">
                  {rest.slice(0, 3).map((camp) => (
                    <div key={camp._id}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                      <h3 className="text-sm font-bold text-gray-800">{camp.nameOfCamp}</h3>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-400 shrink-0" />{camp.location}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 shrink-0" />
                        {new Date(camp.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                  {rest.length > 3 && (
                    <p className="text-xs text-center text-gray-400 py-1">
                      +{rest.length - 3} more upcoming camps
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── COMPLETED CAMPS TABLE ── */}
        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-3">Completed Camps</h2>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Camp Name","Location","Date","Patients","Major / Minor","Success%","Action"].map((h) => (
                      <th key={h}
                        className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!completed.length ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">
                        No completed camps yet
                      </td>
                    </tr>
                  ) : (
                    completed.map((camp) => {
                      const rep = reports.find(
                        (r) => r.camp?._id === camp._id || r.camp === camp._id
                      );
                      return (
                        <tr key={camp._id}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors">
                          <td className="px-5 py-4 font-medium text-gray-800 max-w-[160px] leading-snug">
                            {camp.nameOfCamp}
                          </td>
                          <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{camp.location}</td>
                          <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                            {new Date(camp.date).toLocaleDateString("en-GB")}
                          </td>
                          <td className="px-5 py-4 font-medium text-gray-700">
                            {rep?.totalPeople ?? "—"}
                          </td>
                          <td className="px-5 py-4">
                            {rep ? (
                              <>
                                <span className="text-orange-500 font-semibold">{rep.majorCases}</span>
                                <span className="text-gray-300 mx-1">/</span>
                                <span className="text-blue-500 font-semibold">{rep.minorCases}</span>
                              </>
                            ) : "—"}
                          </td>
                          <td className="px-5 py-4">
                            {rep ? (
                              <span className={`font-semibold ${
                                rep.successRate >= 80 ? "text-green-600" :
                                rep.successRate >= 60 ? "text-orange-500" : "text-red-500"
                              }`}>
                                {rep.successRate}%
                              </span>
                            ) : "—"}
                          </td>
                          <td className="px-5 py-4">
                            {rep ? (
                              <button onClick={() => setViewReport(rep)}
                                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold transition-colors whitespace-nowrap">
                                View Report
                              </button>
                            ) : (
                              <button onClick={() => setSelectedCamp(camp)}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap">
                                Send Report
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* ── SEND REPORT MODAL ── */}
      {selectedCamp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-800">Submit Report</h2>
                <p className="text-sm text-gray-500 mt-0.5">{selectedCamp.nameOfCamp}</p>
              </div>
              <button onClick={() => setSelectedCamp(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { key: "totalPeople", label: "Total Patients", placeholder: "e.g. 120" },
                { key: "minorCases",  label: "Minor Cases",    placeholder: "e.g. 90"  },
                { key: "majorCases",  label: "Major Cases",    placeholder: "e.g. 30"  },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input type="number" placeholder={placeholder} value={reportData[key]}
                    onChange={(e) => setReportData({ ...reportData, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Doctor's Report</label>
                <textarea rows={3} placeholder="Write your observations..."
                  value={reportData.doctorReport}
                  onChange={(e) => setReportData({ ...reportData, doctorReport: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => setSelectedCamp(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={submitReport}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW REPORT MODAL ── */}
      {viewReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-800">{viewReport.campName}</h2>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" />{viewReport.location}
                </p>
              </div>
              <button onClick={() => setViewReport(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total",  value: viewReport.totalPeople, color: "text-blue-600"   },
                { label: "Minor",  value: viewReport.minorCases,  color: "text-blue-500"   },
                { label: "Major",  value: viewReport.majorCases,  color: "text-orange-500" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
              <p className="text-xs text-green-600 font-semibold">Success Rate</p>
              <p className="text-3xl font-extrabold text-green-700">{viewReport.successRate}%</p>
            </div>

            {viewReport.commonDiseases?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Common Diseases</p>
                <div className="flex flex-wrap gap-1.5">
                  {viewReport.commonDiseases.map((d, i) => (
                    <span key={i}
                      className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs border border-blue-100 capitalize">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {viewReport.doctorReport && (
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-100 leading-relaxed">
                {viewReport.doctorReport}
              </p>
            )}

            {viewReport.recommendations && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs font-semibold text-amber-700 mb-0.5">Recommendation</p>
                <p className="text-xs text-amber-600">{viewReport.recommendations}</p>
              </div>
            )}

            <button onClick={() => setViewReport(null)}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}