import { useState, useEffect } from "react";
import { Plus, Trash2, Check, AlertCircle, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import API from "../../services/api";

import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";

export default function AddCamp() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [allMedicines, setAllMedicines] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);

  const [camp, setCamp] = useState({
    nameOfCamp: "", date: "", location: "", description: "", doctorAssigned: "",
  });
  const [medicines, setMedicines] = useState([{ medicine: "", quantity: "" }]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const medRes = await API.get("/medicines");
      const docRes = await API.get("/auth/ngo/doctors");
      setAllMedicines(medRes.data.data || []);
      setAllDoctors(docRes.data.data || []);
    } catch (err) {
      console.error(err);
      showMessage("Failed to load medicines and doctors", "error");
    }
  };

  const addMedicineField = () => setMedicines([...medicines, { medicine: "", quantity: "" }]);
  const removeMedicineField = (i) => { if (medicines.length > 1) setMedicines(medicines.filter((_, idx) => idx !== i)); };
  const handleMedicineChange = (i, field, value) => {
    const updated = [...medicines];
    updated[i][field] = value;
    setMedicines(updated);
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const validateForm = () => {
    if (!camp.nameOfCamp.trim()) { showMessage("Please enter camp name", "error"); return false; }
    if (!camp.date) { showMessage("Please select a date", "error"); return false; }
    if (!camp.location.trim()) { showMessage("Please enter location", "error"); return false; }
    if (!camp.doctorAssigned) { showMessage("Please assign a doctor", "error"); return false; }
    if (medicines.some((m) => !m.medicine || !m.quantity)) { showMessage("Please fill all medicine fields", "error"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = { ...camp, medicines: medicines.map((m) => ({ medicine: m.medicine, quantity: Number(m.quantity) })) };
      await API.post("/camps", payload);
      showMessage("Camp created successfully! 🎉", "success");
      setCamp({ nameOfCamp: "", date: "", location: "", description: "", doctorAssigned: "" });
      setMedicines([{ medicine: "", quantity: "" }]);
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to create camp", "error");
    } finally {
      setLoading(false);
    }
  };

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232563eb' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    paddingRight: "2.5rem",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="lg:ml-64">
        <Topbar title="Add Camp" setOpen={setOpen} />

        <motion.div
          className="p-6 lg:p-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* MESSAGE */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-5 p-3.5 rounded-xl flex items-center gap-3 text-sm font-medium border ${
                  messageType === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {messageType === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="shadow-sm border border-slate-200 rounded-2xl bg-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 px-7">
              <CardTitle className="text-xl font-bold">Camp Details</CardTitle>
              <p className="text-blue-100 text-sm mt-1">Fill in the information below to create a new medical camp</p>
            </CardHeader>

            <CardContent className="p-7 space-y-8">

              {/* CAMP INFORMATION */}
              <section className="space-y-5">
                <SectionTitle title="Camp Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FieldInput
                    label="Camp Name *"
                    placeholder="e.g., Health Awareness Camp 2025"
                    value={camp.nameOfCamp}
                    onChange={(v) => setCamp({ ...camp, nameOfCamp: v })}
                  />
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-slate-700">Date *</Label>
                    <Input
                      type="date"
                      value={camp.date}
                      onChange={(e) => setCamp({ ...camp, date: e.target.value })}
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FieldInput
                      label="Location *"
                      placeholder="e.g., Community Center, Mumbai"
                      value={camp.location}
                      onChange={(v) => setCamp({ ...camp, location: v })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-sm font-semibold text-slate-700">Description (Optional)</Label>
                    <textarea
                      placeholder="Add details about the camp objectives, target audience, etc."
                      value={camp.description}
                      onChange={(e) => setCamp({ ...camp, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none text-slate-900 placeholder:text-slate-400 resize-none text-sm"
                    />
                  </div>
                </div>
              </section>

              <Divider />

              {/* DOCTOR */}
              <section className="space-y-4">
                <SectionTitle title="Assign Doctor" />
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">Select Doctor *</Label>
                  <select
                    value={camp.doctorAssigned}
                    onChange={(e) => setCamp({ ...camp, doctorAssigned: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none text-slate-900 bg-white cursor-pointer appearance-none bg-no-repeat text-sm"
                    style={selectStyle}
                  >
                    <option value="">Choose a doctor...</option>
                    {allDoctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        Dr. {doc.name} ({doc.email})
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              <Divider />

              {/* MEDICINES */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <SectionTitle title="Medicines & Quantities" />
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {medicines.length} item{medicines.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {medicines.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-200 hover:bg-blue-50/20 transition-all"
                      >
                        <div className="md:col-span-7 space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-600">Medicine</Label>
                          <select
                            value={m.medicine}
                            onChange={(e) => handleMedicineChange(i, "medicine", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none text-slate-900 bg-white cursor-pointer text-sm appearance-none bg-no-repeat"
                            style={selectStyle}
                          >
                            <option value="">Select medicine...</option>
                            {allMedicines.map((med) => (
                              <option key={med._id} value={med._id}>{med.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-3 space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-600">Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="0"
                            value={m.quantity}
                            onChange={(e) => handleMedicineChange(i, "quantity", e.target.value)}
                            className="rounded-lg border-slate-200"
                          />
                        </div>
                        <div className="md:col-span-2 flex items-end">
                          <button
                            onClick={() => removeMedicineField(i)}
                            disabled={medicines.length === 1}
                            className="w-full px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-sm font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Remove</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <button
                  onClick={addMedicineField}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-blue-200 text-blue-500 hover:border-blue-400 hover:bg-blue-50 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Medicine
                </button>
              </section>

              {/* SUBMIT */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-200 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {loading ? "Creating Camp..." : "Create Medical Camp"}
              </button>

            </CardContent>
          </Card>

          {/* TIP */}
          <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-xs text-blue-700 leading-relaxed">
              <span className="font-semibold">💡 Tip:</span> Each camp must have at least one assigned doctor and one medicine. You can add multiple medicines using the button above.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
      <div className="w-1 h-5 bg-blue-600 rounded-full" />
      {title}
    </h3>
  );
}

function Divider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />;
}

function FieldInput({ label, placeholder, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-slate-700">{label}</Label>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}