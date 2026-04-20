import { useEffect, useState } from "react";
import API from "../../services/api";
import { Button } from "../../components/ui/button";
import Logout from "../../components/layout/Logout";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Tent,
  CheckCircle2,
  X,
} from "lucide-react";

/* ── tiny inline donut chart (SVG) ─────────────────────── */
function DonutChart({ major = 14, minor = 114 }) {
  const total = major + minor;
  const r = 38;
  const circ = 2 * Math.PI * r;
  const majorArc = (major / total) * circ;
  const minorArc = (minor / total) * circ;
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20">
      {/* minor (blue) */}
      <circle cx="50" cy="50" r={r} fill="none" stroke="#3b82f6" strokeWidth="16"
        strokeDasharray={`${minorArc} ${circ - minorArc}`}
        strokeDashoffset={circ * 0.25} />
      {/* major (orange) */}
      <circle cx="50" cy="50" r={r} fill="none" stroke="#f97316" strokeWidth="16"
        strokeDasharray={`${majorArc} ${circ - majorArc}`}
        strokeDashoffset={circ * 0.25 - minorArc} />
      {/* severity slice (red, small) */}
      <circle cx="50" cy="50" r={r} fill="none" stroke="#ef4444" strokeWidth="16"
        strokeDasharray={`${circ * 0.06} ${circ * 0.94}`}
        strokeDashoffset={circ * 0.25 - minorArc - majorArc} />
      <circle cx="50" cy="50" r="26" fill="white" />
    </svg>
  );
}

/* ── tiny inline bar chart (SVG) ───────────────────────── */
function BarChart() {
  const bars = [
    { label: "Bek", blue: 30, orange: 20 },
    { label: "Minor", blue: 50, orange: 35 },
    { label: "Minor", blue: 40, orange: 50 },
    { label: "Hnt", blue: 25, orange: 15 },
  ];
  return (
    <div className="flex items-end gap-1.5">
      {bars.map((b, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div className="flex items-end gap-0.5">
            <div className="w-3 rounded-t-sm bg-blue-500" style={{ height: b.blue * 0.7 + "px" }} />
            <div className="w-3 rounded-t-sm bg-orange-400" style={{ height: b.orange * 0.7 + "px" }} />
          </div>
          <span className="text-[9px] text-gray-400">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── tiny calendar widget ───────────────────────────────── */
function MiniCalendar() {
  const days = ["S","M","T","W","T","F","S"];
  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = i - 3;
    return d > 0 && d <= 31 ? d : null;
  });
  const highlighted = [8, 20];
  return (
    <div className="mt-2">
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {days.map((d) => (
          <span key={d} className="text-[9px] text-center text-gray-400 font-medium">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => (
          <div
            key={i}
            className={`w-5 h-5 flex items-center justify-center rounded text-[9px]
              ${d === null ? "" : highlighted.includes(d)
                ? "bg-blue-500 text-white font-bold"
                : "text-gray-400"}`}
          >
            {d || ""}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [reports, setReports] = useState([]);
  const [viewReport, setViewReport] = useState(null);
  const [selectedCamp, setSelectedCamp] = useState(null);

  const [reportData, setReportData] = useState({
    totalPeople: "",
    minorCases: "",
    majorCases: "",
    doctorReport: "",
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const up = await API.get("/camps/upcoming");
      const comp = await API.get("/camps/completed");
      const rep = await API.get("/reports/my");
      setUpcoming(up.data.data || []);
      setCompleted(comp.data.data || []);
      setReports(rep.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const submitReport = async () => {
    try {
      await API.post("/reports", {
        campId: selectedCamp._id,
        ...reportData,
        medicinesDistributed: [],
      });
      alert("Report Submitted ✅");
      setSelectedCamp(null);
      setReportData({ totalPeople: "", minorCases: "", majorCases: "", doctorReport: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error ❌");
    }
  };

  /* ── dummy stats ── */
  const DUMMY = { totalCamps: 1, totalPatients: 128, majorCases: 14, minorCases: 114 };

  /* ── split upcoming: first = featured, rest = sidebar ── */
  const [featuredCamp, ...restUpcoming] = upcoming;

  return (
    <div className="min-h-screen bg-[#eef0f5] font-sans">
      <Logout />

      {/* TOPBAR */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="p-6 space-y-6 max-w-screen-xl mx-auto">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Total Camps */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500 font-medium">Total Camps</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{DUMMY.totalCamps}</p>
            <MiniCalendar />
          </div>

          {/* Total Patients */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500 font-medium">Total Patients Checked</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{DUMMY.totalPatients}</p>
            <div className="mt-4 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Major Cases */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500 font-medium">Major Cases</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{DUMMY.majorCases}</p>
            <div className="mt-3 flex items-center gap-3">
              <DonutChart major={DUMMY.majorCases} minor={DUMMY.minorCases} />
              <div className="space-y-1 text-[11px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  Severity
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
                  Major
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  Low
                </div>
              </div>
            </div>
          </div>

          {/* Minor Cases */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500 font-medium">Minor Cases</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{DUMMY.minorCases}</p>
            <div className="mt-3 flex items-end justify-center">
              <BarChart />
            </div>
          </div>
        </div>

        {/* ── UPCOMING CAMPS ── */}
        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-3">Upcoming Camps</h2>

          {upcoming.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-sm text-gray-400">
              No upcoming camps
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">

              {/* Featured card (first camp) */}
              {featuredCamp && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-gray-800">
                      {featuredCamp.nameOfCamp}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200 whitespace-nowrap">
                      Status
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    {new Date(featuredCamp.date).toLocaleDateString("en-US", {
                      month: "long", day: "numeric", year: "numeric",
                    })}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {new Date(featuredCamp.date).toLocaleTimeString("en-US", {
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </div>

                  {featuredCamp.medicines?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {featuredCamp.medicines.slice(0, 3).map((m, i) => (
                        <span key={i}
                          className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                          {m.medicine?.name}
                        </span>
                      ))}
                      {featuredCamp.medicines.length > 3 && (
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs">
                          +{featuredCamp.medicines.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Remaining camps (stacked smaller cards) */}
              {restUpcoming.length > 0 && (
                <div className="space-y-3">
                  {restUpcoming.map((camp) => (
                    <div key={camp._id}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                      <h3 className="text-sm font-bold text-gray-800">{camp.nameOfCamp}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-400" />
                        {camp.location}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── COMPLETED CAMPS ── */}
        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-3">Completed Camps</h2>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500">Camp Name</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500">Location</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500">Date</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500">Patients</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500">Major/Minor</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500">Success%</th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody>
                  {completed.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">
                        No completed camps yet
                      </td>
                    </tr>
                  ) : (
                    completed.map((camp) => {
                      const rep = reports.find((r) => r.camp?._id === camp._id);
                      return (
                        <tr key={camp._id}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors">
                          <td className="px-5 py-4 font-medium text-gray-800">{camp.nameOfCamp}</td>
                          <td className="px-5 py-4 text-gray-500">{camp.location}</td>
                          <td className="px-5 py-4 text-gray-500">
                            {new Date(camp.date).toLocaleDateString("en-GB").replace(/\//g, "/")}
                          </td>
                          <td className="px-5 py-4 text-gray-700">{rep?.totalPeople ?? 0}</td>
                          <td className="px-5 py-4 text-gray-700">
                            {rep ? `${rep.majorCases}/${rep.minorCases}` : "—"}
                          </td>
                          <td className="px-5 py-4">
                            {rep ? (
                              <span className="text-gray-700 font-medium">{rep.successRate}%</span>
                            ) : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => setSelectedCamp(camp)}
                              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold transition-colors"
                            >
                              Send Report
                            </button>
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
              <button
                onClick={() => setSelectedCamp(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
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
                  <input
                    type="number"
                    placeholder={placeholder}
                    value={reportData[key]}
                    onChange={(e) => setReportData({ ...reportData, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Doctor's Report</label>
                <textarea
                  rows={3}
                  placeholder="Write your observations..."
                  value={reportData.doctorReport}
                  onChange={(e) => setReportData({ ...reportData, doctorReport: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setSelectedCamp(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
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
              <h2 className="text-base font-bold text-gray-800">{viewReport.camp?.nameOfCamp}</h2>
              <button onClick={() => setViewReport(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total", value: viewReport.totalPeople, color: "text-blue-600" },
                { label: "Minor", value: viewReport.minorCases,  color: "text-green-600" },
                { label: "Major", value: viewReport.majorCases,  color: "text-red-500"  },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
              <p className="text-xs text-green-600 font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-green-700">{viewReport.successRate}%</p>
            </div>

            {viewReport.doctorReport && (
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-100">
                {viewReport.doctorReport}
              </p>
            )}

            <button
              onClick={() => setViewReport(null)}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}