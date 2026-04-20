import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import API from "../../services/api";

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

export default function AddCamp() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [allMedicines, setAllMedicines] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);

  const [camp, setCamp] = useState({
    nameOfCamp: "",
    date: "",
    location: "",
    description: "",
    doctorAssigned: "", // ✅ FIXED
  });

  const [medicines, setMedicines] = useState([
    { medicine: "", quantity: "" },
  ]);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const medRes = await API.get("/medicines");
      const docRes = await API.get("/auth/ngo/doctors");

      // ✅ backend format: { success, data }
      setAllMedicines(medRes.data.data || []);
      setAllDoctors(docRes.data.data || []);

    } catch (err) {
      console.error(err);
    }
  };

  /* ================= MEDICINE ================= */
  const addMedicineField = () => {
    setMedicines([...medicines, { medicine: "", quantity: "" }]);
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...camp,
        medicines: medicines.map((m) => ({
          medicine: m.medicine,
          quantity: Number(m.quantity),
        })),
      };

      console.log("FINAL PAYLOAD:", payload);

      await API.post("/camps", payload);

      setMessage("Camp created successfully 🎉");

      // RESET
      setCamp({
        nameOfCamp: "",
        date: "",
        location: "",
        description: "",
        doctorAssigned: "",
      });

      setMedicines([{ medicine: "", quantity: "" }]);

    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Error ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Sidebar open={open} setOpen={setOpen} />

      {/* TOPBAR */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white shadow">
        <Menu onClick={() => setOpen(true)} />
        <h2 className="text-lg font-semibold">Add Camp</h2>
      </div>

      <div className="p-6">

        <Card className="max-w-3xl mx-auto shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-green-600 text-xl">
              Create Medical Camp
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {message && (
              <div className="p-3 bg-green-100 text-green-700 rounded">
                {message}
              </div>
            )}

            {/* CAMP DETAILS */}
            <div className="grid grid-cols-2 gap-6">

              <InputField label="Camp Name"
                value={camp.nameOfCamp}
                onChange={(v) => setCamp({ ...camp, nameOfCamp: v })}
              />

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={camp.date}
                  onChange={(e) =>
                    setCamp({ ...camp, date: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2">
                <InputField label="Location"
                  value={camp.location}
                  onChange={(v) => setCamp({ ...camp, location: v })}
                />
              </div>

              <div className="col-span-2">
                <InputField label="Description"
                  value={camp.description}
                  onChange={(v) => setCamp({ ...camp, description: v })}
                />
              </div>

            </div>

            {/* DOCTOR */}
            <div className="space-y-2">
              <Label>Assign Doctor</Label>

              <select
                className="w-full border rounded p-2"
                value={camp.doctorAssigned}
                onChange={(e) =>
                  setCamp({ ...camp, doctorAssigned: e.target.value })
                }
              >
                <option value="">Select Doctor</option>

                {allDoctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} ({doc.email})
                  </option>
                ))}
              </select>
            </div>

            {/* MEDICINES */}
            <div className="space-y-4">
              <Label>Medicines</Label>

              {medicines.map((m, i) => (
                <div key={i} className="grid grid-cols-2 gap-4">

                  <select
                    className="border rounded p-2"
                    value={m.medicine}
                    onChange={(e) =>
                      handleMedicineChange(i, "medicine", e.target.value)
                    }
                  >
                    <option value="">Select Medicine</option>

                    {allMedicines.map((med) => (
                      <option key={med._id} value={med._id}>
                        {med.name}
                      </option>
                    ))}
                  </select>

                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={m.quantity}
                    onChange={(e) =>
                      handleMedicineChange(i, "quantity", e.target.value)
                    }
                  />

                </div>
              ))}

              <Button variant="outline" onClick={addMedicineField}>
                + Add Medicine
              </Button>
            </div>

            {/* SUBMIT */}
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSubmit}
            >
              Create Camp
            </Button>

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