import { useEffect, useState } from "react";
import { Menu, User } from "lucide-react";
import API from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";

/* shadcn */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function NgoDoctors() {
  const [open, setOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const ngoId = "666034"; // 🔥 replace dynamically later

  /* ---------------- FETCH DOCTORS ---------------- */
  const fetchDoctors = async () => {
    try {
      const res = await API.get(`/auth/ngo/doctors`);
      setDoctors(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* TOPBAR */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b shadow-sm">
        <Menu onClick={() => setOpen(true)} className="cursor-pointer" />
        <h2 className="text-lg font-semibold">NGO Doctors</h2>
      </div>

      {/* CONTENT */}
      <div className="p-6">

        {/* LOADING */}
        {loading && (
          <div className="text-center text-gray-500">Loading doctors...</div>
        )}

        {/* EMPTY */}
        {!loading && doctors.length === 0 && (
          <div className="text-center text-gray-500">
            No doctors found 🥲
          </div>
        )}

        {/* GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {doctors.map((doc) => (
            <Card
              key={doc._id}
              className="shadow-md hover:shadow-xl transition rounded-2xl border"
            >
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <User className="text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {doc.name || "Unnamed Doctor"}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {doc.specialization || "General"}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">

                <p>
                  📧 <span className="font-medium">Email:</span>{" "}
                  {doc.email || "N/A"}
                </p>

                <p>
                  🏥 <span className="font-medium">NGO:</span>{" "}
                  {doc.ngo?.ngoName || "N/A"}
                </p>

                <p>
                  📩 <span className="font-medium">NGO Email:</span>{" "}
                  {doc.ngo?.email || "N/A"}
                </p>

                {/* STATUS */}
                <div className="mt-3">
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Active
                  </span>
                </div>

              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    </div>
  );
}