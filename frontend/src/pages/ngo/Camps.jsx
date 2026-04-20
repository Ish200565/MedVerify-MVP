import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Menu,
  Search,
  Bell,
  MapPin,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";

export default function Camps() {
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [open, setOpen] = useState(false);
  const [expandedMeds, setExpandedMeds] = useState({});

  /* Reports (dummy) */
  const reports = [
    {
      _id: "1",
      campName: "Free Health Camp",
      location: "Andheri West",
      doctorAssigned: "Dr. Sharma",
      totalPeople: 120,
      minorCases: 90,
      majorCases: 30,
      successRate: 90,
      doctorReport:
        "Most patients had minor illnesses and were treated successfully.",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const up = await API.get("/camps/upcoming");
      const comp = await API.get("/camps/completed");
      setUpcoming(up.data.data || []);
      setCompleted(comp.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMeds = (id) =>
    setExpandedMeds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-[#f0f2f8] font-sans">
      <Sidebar open={open} setOpen={setOpen} />

      {/* TOPBAR */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-base font-semibold text-gray-800 tracking-tight">
            Camps
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 ml-1">
            <img
              src="https://i.pravatar.cc/32"
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="p-6 space-y-6 max-w-screen-xl mx-auto">

        {/* ── UPCOMING CAMPS ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Upcoming Camps
          </h2>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h3 className="text-base font-semibold text-gray-800">
              Upcoming Camps
            </h3>

            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_auto_auto] border-b border-gray-200 bg-white">
                <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                  Camp Name
                </div>
                <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200 min-w-[180px]">
                  Date
                </div>
                <div className="px-4 py-3 text-sm font-semibold text-gray-700 min-w-[160px]" />
              </div>

              {/* Rows */}
              {upcoming.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-400 text-center">
                  No upcoming camps
                </div>
              ) : (
                upcoming.map((camp) => {
                  const medCount = camp.medicines?.length || 0;
                  const isOpen = expandedMeds[camp._id];
                  return (
                    <div key={camp._id}>
                      <div className="grid grid-cols-[1fr_auto_auto] border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors">
                        {/* Name + location */}
                        <div className="px-4 py-3 border-r border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">
                            {camp.nameOfCamp}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-red-400" />
                            {camp.location}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="px-4 py-3 border-r border-gray-100 min-w-[180px] flex items-center">
                          <span className="text-sm text-gray-700">
                            {new Date(camp.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Medicines toggle */}
                        <div className="px-4 py-3 min-w-[160px] flex items-center justify-end">
                          {medCount > 0 && (
                            <button
                              onClick={() => toggleMeds(camp._id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm text-gray-700 font-medium"
                            >
                              {medCount} Medicines
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded meds */}
                      {isOpen && (
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-2">
                          {camp.medicines.map((m, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100"
                            >
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

            {/* View All */}
            <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ── COMPLETED CAMPS ── */}
        <section>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Left panel */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
              <h3 className="text-base font-semibold text-gray-800">
                Completed Camps
              </h3>

              <div className="space-y-3">
                {completed.slice(0, 2).map((camp) => (
                  <CompletedCard key={camp._id} camp={camp} />
                ))}
                {completed.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No completed camps
                  </p>
                )}
              </div>

              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right panel */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
              <h3 className="text-base font-semibold text-gray-800">
                Completed Camps
              </h3>

              <div className="space-y-3">
                {completed.slice(2, 4).map((camp) => (
                  <CompletedCard key={camp._id} camp={camp} />
                ))}
                {completed.length <= 2 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No more completed camps
                  </p>
                )}
              </div>

              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ── REPORTS ── */}
        <section>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h3 className="text-base font-semibold text-gray-800">Reports</h3>

            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Camp</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Minor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Major</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Success</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((rep) => (
                    <tr
                      key={rep._id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {rep.campName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{rep.doctorAssigned}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{rep.totalPeople}</td>
                      <td className="px-4 py-3">
                        <span className="text-green-600 font-semibold">{rep.minorCases}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-red-500 font-semibold">{rep.majorCases}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                          {rep.successRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── COMPLETED CAMP CARD ── */
function CompletedCard({ camp }) {
  const medCount = camp.medicines?.length || 0;

  return (
    <div className="rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow bg-white space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-800">{camp.nameOfCamp}</h4>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-red-400" />
            {camp.location}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(camp.date).toDateString()}
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0">
          View Report <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          Completed
        </span>
        {medCount > 0 && (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <CalendarDays className="w-3.5 h-3.5" />
            {medCount} Medicines
          </span>
        )}
      </div>
    </div>
  );
}