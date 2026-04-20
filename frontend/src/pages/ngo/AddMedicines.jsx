import { useState } from "react";
import { ScanLine, Loader, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { Html5QrcodeScanner } from "html5-qrcode";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";

export default function AddMedicine() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [medicineId, setMedicineId] = useState(null);

  const [medicine, setMedicine] = useState({ name: "", type: "", manufacturer: "", barcode: "" });
  const [stock, setStock] = useState({ unitType: "", packSize: "", quantity: "", batchNumber: "", expiryDate: "" });

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render(async (decodedText) => {
      scanner.clear();
      setMedicine((prev) => ({ ...prev, barcode: decodedText }));
      try {
        const res = await API.get(`/stocks/barcode/${decodedText}`);
        const { medicine: med } = res.data;
        setMedicine({ name: med.name, type: med.type, manufacturer: med.manufacturer, barcode: decodedText });
        setMedicineId(med._id);
        showMessage("Medicine found from barcode ✅", "success");
        setStep(2);
      } catch {
        showMessage("New medicine — fill details ✍️", "info");
      }
    });
  };

  const handleMedicineNext = async () => {
    try {
      setLoading(true);
      if (medicineId) { setStep(2); return; }
      if (!medicine.name || !medicine.type) { showMessage("Name & Type are required", "error"); return; }
      const res = await API.post("/medicines", { name: medicine.name, type: medicine.type, manufacturer: medicine.manufacturer });
      setMedicineId(res.data.data._id);
      showMessage("Medicine added ✅", "success");
      setStep(2);
    } catch (err) {
      showMessage(err.response?.data?.message || "Error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStockSubmit = async () => {
    try {
      setLoading(true);
      await API.post("/stocks", {
        medicineId,
        unitType: stock.unitType,
        packSize: Number(stock.packSize),
        quantity: Number(stock.quantity),
        batchNumber: stock.batchNumber,
        expiryDate: stock.expiryDate,
        barcode: medicine.barcode,
      });
      showMessage("Stock added successfully 🎉", "success");
      setStep(1);
      setMedicineId(null);
      setMedicine({ name: "", type: "", manufacturer: "", barcode: "" });
      setStock({ unitType: "", packSize: "", quantity: "", batchNumber: "", expiryDate: "" });
    } catch (err) {
      showMessage(err.response?.data?.message || "Stock error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="lg:ml-64">
        <Topbar title={step === 1 ? "Add Medicine" : "Add Stock"} setOpen={setOpen} />

        <motion.div
          className="p-6 lg:p-8 max-w-3xl mx-auto"
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

          {/* STEP INDICATOR */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                  step === s ? "bg-blue-600 text-white shadow-md shadow-blue-200" :
                  step > s ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                <span className={`text-xs font-medium ${step === s ? "text-slate-800" : "text-slate-400"}`}>
                  {s === 1 ? "Medicine Details" : "Stock Details"}
                </span>
                {s < 2 && <div className={`h-px w-8 ${step > 1 ? "bg-emerald-400" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>

          <Card className="shadow-sm border border-slate-200 rounded-2xl bg-white overflow-hidden">
            {/* CARD HEADER */}
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 px-7">
              <CardTitle className="text-xl font-bold">
                {step === 1 ? "Medicine Information" : "Stock Information"}
              </CardTitle>
              <p className="text-blue-100 text-sm mt-1">Step {step} of 2</p>
            </CardHeader>

            <CardContent className="p-7 space-y-6">

              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <SectionTitle title="Scan or Enter Details" />
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">Barcode</Label>
                      <div className="flex gap-2">
                        <Input
                          value={medicine.barcode}
                          onChange={(e) => setMedicine({ ...medicine, barcode: e.target.value })}
                          placeholder="Scan or type barcode..."
                          className="rounded-xl border-slate-200 flex-1"
                        />
                        <button
                          onClick={startScanner}
                          className="px-4 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"
                        >
                          <ScanLine size={16} />
                        </button>
                      </div>
                      <div id="reader" className="mt-2" />
                    </div>
                    <FieldInput label="Name *" value={medicine.name} onChange={(v) => setMedicine({ ...medicine, name: v })} />
                    <FieldInput label="Type *" value={medicine.type} onChange={(v) => setMedicine({ ...medicine, type: v })} />
                    <div className="md:col-span-2">
                      <FieldInput label="Manufacturer" value={medicine.manufacturer} onChange={(v) => setMedicine({ ...medicine, manufacturer: v })} />
                    </div>
                  </div>
                  <ActionButton loading={loading} text="Next → Add Stock" onClick={handleMedicineNext} />
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <SectionTitle title="Stock Details" />
                  <div className="grid md:grid-cols-2 gap-5">
                    <FieldInput label="Unit Type *" value={stock.unitType} onChange={(v) => setStock({ ...stock, unitType: v })} />
                    <FieldInput label="Pack Size" value={stock.packSize} onChange={(v) => setStock({ ...stock, packSize: v })} />
                    <FieldInput label="Quantity *" value={stock.quantity} onChange={(v) => setStock({ ...stock, quantity: v })} />
                    <FieldInput label="Batch Number" value={stock.batchNumber} onChange={(v) => setStock({ ...stock, batchNumber: v })} />
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">Expiry Date</Label>
                      <Input
                        type="date"
                        value={stock.expiryDate}
                        onChange={(e) => setStock({ ...stock, expiryDate: e.target.value })}
                        className="rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      ← Back
                    </button>
                    <ActionButton loading={loading} text="Add Stock" onClick={handleStockSubmit} className="flex-1" />
                  </div>
                </>
              )}

            </CardContent>
          </Card>
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

function FieldInput({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-slate-700">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function ActionButton({ loading, text, onClick, className = "w-full" }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${className} py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-200 hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70`}
    >
      {loading ? <Loader className="animate-spin w-4 h-4" /> : <Check className="w-4 h-4" />}
      {text}
    </button>
  );
}