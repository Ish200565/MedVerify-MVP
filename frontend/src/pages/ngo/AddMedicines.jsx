import { useState } from "react";
import { Menu, ScanLine } from "lucide-react";
import API from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";
import { Html5QrcodeScanner } from "html5-qrcode";

/* shadcn */
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";

export default function AddMedicine() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [medicineId, setMedicineId] = useState(null);

  const [medicine, setMedicine] = useState({
    name: "",
    type: "",
    manufacturer: "",
    barcode: "",
  });

  const [stock, setStock] = useState({
    unitType: "",
    packSize: "",
    quantity: "",
    batchNumber: "",
    expiryDate: "",
  });

  /* ---------------- BARCODE ---------------- */
  const startScanner = () => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(async (decodedText) => {
      scanner.clear();

      setMedicine((prev) => ({ ...prev, barcode: decodedText }));

      try {
        const res = await API.get(`/stocks/barcode/${decodedText}`);

        const { medicine, stock } = res.data;

        setMedicine({
          name: medicine.name,
          type: medicine.type,
          manufacturer: medicine.manufacturer,
          barcode: decodedText,
        });

        setMedicineId(medicine._id);

        setMessage("Medicine found from barcode ✅");

        setStep(2);

      } catch {
        setMessage("New medicine — fill details ✍️");
      }
    });
  };

  /* ---------------- STEP 1 ---------------- */
  const handleMedicineNext = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (medicineId) {
        setStep(2);
        return;
      }

      if (!medicine.name || !medicine.type) {
        setMessage("Name & Type required ❌");
        return;
      }

      const res = await API.post("/medicines", {
        name: medicine.name,
        type: medicine.type,
        manufacturer: medicine.manufacturer,
      });

      const id = res.data.data._id;

      setMedicineId(id);
      setMessage("Medicine added ✅");

      setStep(2);

    } catch (err) {
      setMessage(err.response?.data?.message || "Error ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STEP 2 ---------------- */
  const handleStockSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      await API.post("/stocks", {
        medicineId,
        unitType: stock.unitType,
        packSize: Number(stock.packSize),
        quantity: Number(stock.quantity),
        batchNumber: stock.batchNumber,
        expiryDate: stock.expiryDate,
        barcode: medicine.barcode, // 🔥 IMPORTANT
      });

      setMessage("Stock added successfully 🎉");

      // RESET
      setStep(1);
      setMedicineId(null);

      setMedicine({
        name: "",
        type: "",
        manufacturer: "",
        barcode: "",
      });

      setStock({
        unitType: "",
        packSize: "",
        quantity: "",
        batchNumber: "",
        expiryDate: "",
      });

    } catch (err) {
      setMessage(err.response?.data?.message || "Stock error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar open={open} setOpen={setOpen} />

      {/* TOPBAR */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white shadow">
        <Menu onClick={() => setOpen(true)} />
        <h2 className="font-semibold">
          {step === 1 ? "Add Medicine" : "Add Stock"}
        </h2>
      </div>

      <div className="p-6">

        <Card className="max-w-3xl mx-auto shadow">
          <CardHeader>
            <CardTitle>Step {step} of 2</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {message && (
              <div className="bg-green-100 p-3 rounded">{message}</div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-6">

                <div className="col-span-2">
                  <Label>Scan Barcode</Label>
                  <div className="flex gap-2">
                    <Input
                      value={medicine.barcode}
                      onChange={(e) =>
                        setMedicine({ ...medicine, barcode: e.target.value })
                      }
                    />
                    <Button onClick={startScanner}>
                      <ScanLine size={16} />
                    </Button>
                  </div>
                  <div id="reader" />
                </div>

                <InputField label="Name *" value={medicine.name}
                  onChange={(v) => setMedicine({ ...medicine, name: v })} />

                <InputField label="Type *" value={medicine.type}
                  onChange={(v) => setMedicine({ ...medicine, type: v })} />

                <div className="col-span-2">
                  <InputField label="Manufacturer" value={medicine.manufacturer}
                    onChange={(v) => setMedicine({ ...medicine, manufacturer: v })} />
                </div>

                <Button onClick={handleMedicineNext} className="col-span-2">
                  Next → Add Stock
                </Button>

              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-6">

                <InputField label="Unit Type *"
                  value={stock.unitType}
                  onChange={(v) => setStock({ ...stock, unitType: v })} />

                <InputField label="Pack Size"
                  value={stock.packSize}
                  onChange={(v) => setStock({ ...stock, packSize: v })} />

                <InputField label="Quantity *"
                  value={stock.quantity}
                  onChange={(v) => setStock({ ...stock, quantity: v })} />

                <InputField label="Batch Number"
                  value={stock.batchNumber}
                  onChange={(v) => setStock({ ...stock, batchNumber: v })} />

                <div className="col-span-2">
                  <Label>Expiry Date</Label>
                  <Input type="date"
                    value={stock.expiryDate}
                    onChange={(e) =>
                      setStock({ ...stock, expiryDate: e.target.value })
                    }
                  />
                </div>

                <Button onClick={handleStockSubmit} className="col-span-2">
                  Add Stock
                </Button>

              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* INPUT FIELD */
function InputField({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}