import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
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

  /* ---------------- BARCODE SCANNER ---------------- */
  const startScanner = () => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(async (decodedText) => {
      scanner.clear();

      setMedicine((prev) => ({ ...prev, barcode: decodedText }));

      try {
        const res = await API.get(`/medicines/barcode/${decodedText}`);

        const data = res.data;

        setMedicine({
          name: data.name,
          type: data.type,
          manufacturer: data.manufacturer,
          barcode: data.barcode,
        });

        setMedicineId(data._id);
        setMessage("Medicine found ✅");

        // 🚀 go to stock directly
        setStep(2);

      } catch {
        setMessage("New medicine, fill details ✍️");
      }
    });
  };

  /* ---------------- STEP 1 ---------------- */
  const handleMedicineNext = async () => {
    try {
      setLoading(true);
      setMessage("");

      // already scanned & exists
      if (medicineId) {
        setStep(2);
        return;
      }

      if (!medicine.name || !medicine.type) {
        setMessage("Name & Type required ❌");
        return;
      }

      const res = await API.post("/medicines", medicine);

      console.log("MED CREATED:", res.data);

      const id = res.data._id || res.data.medicine?._id;

      if (!id) throw new Error("Medicine ID missing");

      setMedicineId(id);
      setMessage("Medicine added ✅");

      // 🚀 FIXED: always go next
      setStep(2);

    } catch (err) {
      console.error(err.response?.data || err.message);
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

      if (!medicineId) {
        setMessage("Medicine ID missing ❌");
        return;
      }

      if (!stock.unitType || !stock.quantity) {
        setMessage("UnitType & Quantity required ❌");
        return;
      }
        
      await API.post("/stocks", {
        medicineId,
        unitType: stock.unitType,
        packSize: Number(stock.packSize),
        quantity: Number(stock.quantity),
        batchNumber: stock.batchNumber,
        expiryDate: stock.expiryDate || null,
      });

      setMessage("Stock added successfully 🎉");

      // reset
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
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Stock error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">

      <Sidebar open={open} setOpen={setOpen} />

      {/* TOPBAR */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b shadow-sm">
        <Menu onClick={() => setOpen(true)} className="cursor-pointer" />
        <h2 className="text-lg font-semibold">
          {step === 1 ? "Add Medicine" : "Add Stock"}
        </h2>
      </div>

      <div className="p-6">

        <Card className="max-w-3xl mx-auto shadow-lg border">
          <CardHeader>
            <CardTitle className="text-green-600 text-xl">
              Step {step} of 2
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {message && (
              <div className="p-3 bg-green-100 text-green-700 rounded">
                {message}
              </div>
            )}

            {/* ---------------- STEP 1 ---------------- */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-6">

                {/* BARCODE */}
                <div className="space-y-2 col-span-2">
                  <Label>Scan Barcode</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter barcode"
                      value={medicine.barcode}
                      onChange={(e) =>
                        setMedicine({
                          ...medicine,
                          barcode: e.target.value,
                        })
                      }
                    />
                    <Button onClick={startScanner}>Scan</Button>
                  </div>
                  <div id="reader" />
                </div>

                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={medicine.name}
                    onChange={(e) =>
                      setMedicine({ ...medicine, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Input
                    value={medicine.type}
                    onChange={(e) =>
                      setMedicine({ ...medicine, type: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Manufacturer</Label>
                  <Input
                    value={medicine.manufacturer}
                    onChange={(e) =>
                      setMedicine({
                        ...medicine,
                        manufacturer: e.target.value,
                      })
                    }
                  />
                </div>

                <Button
                  className="col-span-2 bg-green-600"
                  onClick={handleMedicineNext}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Next → Add Stock"}
                </Button>

              </div>
            )}

            {/* ---------------- STEP 2 ---------------- */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-6">

                <div className="space-y-2">
                  <Label>Unit Type *</Label>
                  <Input
                    placeholder="Strip / Box"
                    value={stock.unitType}
                    onChange={(e) =>
                      setStock({ ...stock, unitType: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pack Size</Label>
                  <Input
                    type="number"
                    value={stock.packSize}
                    onChange={(e) =>
                      setStock({ ...stock, packSize: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    value={stock.quantity}
                    onChange={(e) =>
                      setStock({ ...stock, quantity: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Batch Number</Label>
                  <Input
                    value={stock.batchNumber}
                    onChange={(e) =>
                      setStock({ ...stock, batchNumber: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Expiry Date</Label>
                  <Input
                    type="date"
                    value={stock.expiryDate}
                    onChange={(e) =>
                      setStock({ ...stock, expiryDate: e.target.value })
                    }
                  />
                </div>

                <Button
                  className="col-span-2 bg-green-600"
                  onClick={handleStockSubmit}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Stock"}
                </Button>

              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}