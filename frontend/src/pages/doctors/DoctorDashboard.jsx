import { useEffect, useState } from "react";
import API from "../../services/api";

/* UI */
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Logout from "../../components/layout/Logout";
/* Charts */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DoctorDashboard() {
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [viewReport, setViewReport] = useState(null);

  const [report, setReport] = useState({
    totalPeople: "",
    minorCases: "",
    majorCases: "",
    doctorReport: "",
  });

  /* ================= FETCH ================= */
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

  /* ================= SUBMIT REPORT ================= */
  const submitReport = async () => {
    try {
      await API.post("/reports/add", {
        campId: selectedCamp._id,
        ...report,
        medicinesDistributed: [],
      });

      alert("Report Submitted ✅");
      setSelectedCamp(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error ❌");
    }
  };

  /* ================= DUMMY REPORT ================= */
  const dummyReport = {
    campName: "Free Health Camp",
    location: "Andheri West",
    doctorAssigned: "Dr. Allen Koshy",
    campDescription: "General health checkup",
    totalPeople: 120,
    minorCases: 90,
    majorCases: 30,
    medicinesDistributed: [
      {
        medicine: { name: "Paracetamol", type: "Tablet" },
        quantity: 5,
      },
    ],
    doctorReport:
      "Most patients had minor illnesses and were treated successfully.",
    successRate: 90,
  };

  /* ================= GRAPH DATA ================= */
  const patientData = [
    { name: "Camp1", patients: 120 },
    { name: "Camp2", patients: 90 },
    { name: "Camp3", patients: 150 },
  ];

  const caseData = [
    { name: "Minor", value: 90 },
    { name: "Major", value: 30 },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="min-h-screen bg-green-50">
 <Logout/>
      {/* ================= TOPBAR ================= */}
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b shadow">
        <h1 className="text-xl font-bold text-green-600">MedVerify</h1>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
            DR
          </div>
          <span>Allen</span>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-3 gap-4 px-6 mt-6">

        <div className="bg-white border rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Total Camps</p>
          <h2 className="text-xl font-bold">
            {upcoming.length + completed.length}
          </h2>
        </div>

        <div className="bg-white border rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Upcoming</p>
          <h2 className="text-xl font-bold">{upcoming.length}</h2>
        </div>

        <div className="bg-white border rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-xl font-bold">{completed.length}</h2>
        </div>

      </div>

      <div className="p-6 space-y-8">

        {/* ================= UPCOMING ================= */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Upcoming Camps</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {upcoming.map((camp) => (
              <Card key={camp._id} className="border rounded-xl shadow">
                <CardContent className="p-5 space-y-2">
                  <h3 className="font-semibold text-lg">
                    {camp.nameOfCamp}
                  </h3>

                  <p className="text-sm text-gray-500">
                    📍 {camp.location}
                  </p>

                  <Button
                    className="bg-green-600"
                    onClick={() => setSelectedCamp(camp)}
                  >
                    Send Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ================= COMPLETED ================= */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Completed Camps</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {completed.map((camp) => (
              <Card key={camp._id} className="border rounded-xl shadow">
                <CardContent className="p-5 space-y-2">
                  <h3>{camp.nameOfCamp}</h3>

                  <Button
                    variant="outline"
                    onClick={() => setViewReport(camp)}
                  >
                    Show Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ================= GRAPHS ================= */}
        <div className="grid md:grid-cols-2 gap-6">

          <Card className="p-4 border shadow">
            <h3 className="mb-2 font-semibold">Patients</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={patientData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4 border shadow">
            <h3 className="mb-2 font-semibold">Case Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={caseData} dataKey="value">
                  {caseData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

        </div>

      </div>

      {/* ================= REPORT FORM ================= */}
      {selectedCamp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-[450px] rounded-xl shadow-xl p-6 space-y-4">

            <h2 className="font-semibold text-lg">
              Report: {selectedCamp.nameOfCamp}
            </h2>

            <input
              className="w-full border p-2 rounded"
              placeholder="Total Patients"
              onChange={(e) =>
                setReport({ ...report, totalPeople: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Minor Cases"
              onChange={(e) =>
                setReport({ ...report, minorCases: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Major Cases"
              onChange={(e) =>
                setReport({ ...report, majorCases: e.target.value })
              }
            />

            <textarea
              className="w-full border p-2 rounded"
              placeholder="Doctor Report"
              onChange={(e) =>
                setReport({ ...report, doctorReport: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <Button onClick={() => setSelectedCamp(null)}>Cancel</Button>
              <Button className="bg-green-600" onClick={submitReport}>
                Submit
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* ================= VIEW REPORT ================= */}
      {viewReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-[500px] rounded-xl shadow-xl p-6 space-y-4">

            <h2 className="text-lg font-semibold text-green-600">
              {dummyReport.campName}
            </h2>

            <p><b>Location:</b> {dummyReport.location}</p>
            <p><b>Doctor:</b> {dummyReport.doctorAssigned}</p>

            <div className="grid grid-cols-3 gap-3">
              <div className="border p-3 text-center rounded">
                Total: {dummyReport.totalPeople}
              </div>
              <div className="border p-3 text-center rounded text-green-600">
                Minor: {dummyReport.minorCases}
              </div>
              <div className="border p-3 text-center rounded text-red-500">
                Major: {dummyReport.majorCases}
              </div>
            </div>

            <div>
              <b>Medicines:</b>
              {dummyReport.medicinesDistributed.map((m, i) => (
                <p key={i}>
                  {m.medicine.name} - {m.quantity}
                </p>
              ))}
            </div>

            <div className="border p-3 rounded text-center bg-green-50">
              Success Rate: {dummyReport.successRate}%
            </div>

            <p>{dummyReport.doctorReport}</p>

            <Button onClick={() => setViewReport(null)}>Close</Button>

          </div>
        </div>
      )}

    </div>
  );
}