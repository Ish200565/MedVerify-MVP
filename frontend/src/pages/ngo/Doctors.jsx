import { useEffect, useState } from "react";
import { User, Loader2, Stethoscope, Mail } from "lucide-react";
import { motion } from "framer-motion";
import API from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function NgoDoctors() {
  const [open, setOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const res = await API.get(`/auth/ngo/doctors`);
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="lg:ml-64">
        <Topbar title="Doctors" setOpen={setOpen} />

        <motion.div
          className="p-6 lg:p-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* HEADER */}
          <motion.div variants={cardVariants} className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Doctors List</h1>
            <p className="text-slate-500 text-sm mt-1">All registered doctors in your NGO</p>
          </motion.div>

          {/* LOADING */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin mb-3 w-6 h-6" />
              <span className="text-sm">Loading doctors...</span>
            </div>
          )}

          {/* EMPTY */}
          {!loading && doctors.length === 0 && (
            <div className="text-center py-20 border border-slate-200 rounded-2xl bg-white">
              <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No doctors found</p>
              <p className="text-slate-400 text-sm mt-1">Doctors registered to your NGO will appear here</p>
            </div>
          )}

          {/* GRID */}
          {!loading && doctors.length > 0 && (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={containerVariants}
            >
              {doctors.map((doc) => (
                <motion.div key={doc._id} variants={cardVariants}>
                  <Card className="border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white group">
                    <CardHeader className="flex flex-row items-center gap-4 pb-3 border-b border-slate-100">
                      {/* AVATAR */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-100">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-sm font-semibold text-slate-900 truncate">
                          {doc.name || "Unnamed Doctor"}
                        </CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                            <Stethoscope className="w-2.5 h-2.5" />
                            {doc.specialization || "General"}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate text-slate-500 text-xs">{doc.email || "N/A"}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}