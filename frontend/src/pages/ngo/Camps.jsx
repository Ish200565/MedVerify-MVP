import { useEffect, useState } from "react";
import API from "../../services/api";
import { Menu } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
export default function Camps() {
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [open, setOpen] = useState(false);
  /* ✅ DUMMY REPORTS */
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

  return (
    
<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* TOPBAR */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3">
          <Menu className="cursor-pointer" onClick={() => setOpen(true)} />
          <h2 className="text-lg font-semibold">Camps</h2>
        </div>

      </div>
      {/* ================= UPCOMING ================= */}
      <div className="bg-white border rounded-xl m-5 shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Upcoming Camps</h2>

        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden">

            <thead className="bg-green-100 text-left text-sm">
              <tr>
                <th className="p-3 border">Camp Name</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Medicines</th>
              </tr>
            </thead>

            <tbody>
              {upcoming.map((camp) => (
                <tr key={camp._id} className="hover:bg-gray-50 text-sm">

                  <td className="p-3 border font-medium">
                    {camp.nameOfCamp}
                  </td>

                  <td className="p-3 border">{camp.location}</td>

                  <td className="p-3 border">
                    {new Date(camp.date).toDateString()}
                  </td>

                  <td className="p-3 border">
                    {camp.medicines?.map((m, i) => (
                      <span
                        key={i}
                        className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded mr-1 text-xs"
                      >
                        {m.medicine?.name}
                      </span>
                    ))}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* ================= COMPLETED ================= */}
      <div className="bg-white border m-5 rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Completed Camps</h2>

        <div className="grid md:grid-cols-2 gap-4">

          {completed.map((camp) => (
            <div
              key={camp._id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition bg-white"
            >
              <h3 className="font-semibold text-lg">
                {camp.nameOfCamp}
              </h3>

              <p className="text-sm text-gray-500">
                📍 {camp.location}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(camp.date).toDateString()}
              </p>

              <div className="mt-2 text-xs text-green-600 font-medium">
                ✔ Completed
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* ================= REPORTS ================= */}
      <div className="bg-white m-5 border rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Reports</h2>

        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden">

            <thead className="bg-green-100 text-sm">
              <tr>
                <th className="p-3 border">Camp</th>
                <th className="p-3 border">Doctor</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Minor</th>
                <th className="p-3 border">Major</th>
                <th className="p-3 border">Success</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((rep) => (
                <tr key={rep._id} className="hover:bg-gray-50 text-sm">

                  <td className="p-3 border font-medium">
                    {rep.campName}
                  </td>

                  <td className="p-3 border">
                    {rep.doctorAssigned}
                  </td>

                  <td className="p-3 border">
                    {rep.totalPeople}
                  </td>

                  <td className="p-3 border text-green-600 font-medium">
                    {rep.minorCases}
                  </td>

                  <td className="p-3 border text-red-500 font-medium">
                    {rep.majorCases}
                  </td>

                  <td className="p-3 border">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                      {rep.successRate}%
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}