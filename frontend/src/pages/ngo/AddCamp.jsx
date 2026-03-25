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
import Logout from "../../components/layout/Logout";

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
    doctorAssigned: {
      name: "",
      email: "",
    },
  });

  const [medicines, setMedicines] = useState([
    { medicine: "", quantity: "" },
  ]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const medRes = await API.get("/medicines/getmedicine");
      const docRes = await API.get("/auth/ngo/doctors");

      console.log("MED:", medRes.data);
      console.log("DOC:", docRes.data);

      // ✅ SAFE ARRAY EXTRACTION
      const meds = Array.isArray(medRes.data)
        ? medRes.data
        : medRes.data?.data || medRes.data?.medicines || [];

      const docs = Array.isArray(docRes.data)
        ? docRes.data
        : docRes.data?.data || docRes.data?.doctors || [];

      setAllMedicines(meds);
      setAllDoctors(docs);

    } catch (err) {
      console.error(err);
      setAllMedicines([]);
      setAllDoctors([]);
    }
  };

  /* ================= MEDICINE HANDLING ================= */
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
        medicines,
      };

      console.log("FINAL PAYLOAD:", payload);

      await API.post("/camps/add", payload);

      setMessage("Camp created successfully 🎉");

    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Error occurred ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* TOPBAR */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b shadow-sm">
        <Menu onClick={() => setOpen(true)} className="cursor-pointer" />
        <h2 className="text-lg font-semibold">Add Camp</h2>
      </div>
 <Logout/>
      {/* CONTENT */}
      <div className="p-6">

        <Card className="max-w-3xl mx-auto shadow-lg border">
          <CardHeader>
            <CardTitle className="text-green-600 text-xl">
              Create Medical Camp
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* MESSAGE */}
            {message && (
              <div className="p-3 bg-green-100 text-green-700 rounded">
                {message}
              </div>
            )}

            {/* CAMP DETAILS */}
            <div className="grid grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label>Camp Name</Label>
                <Input
                  value={camp.nameOfCamp}
                  onChange={(e) =>
                    setCamp({ ...camp, nameOfCamp: e.target.value })
                  }
                />
              </div>

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

              <div className="space-y-2 col-span-2">
                <Label>Location</Label>
                <Input
                  value={camp.location}
                  onChange={(e) =>
                    setCamp({ ...camp, location: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Description</Label>
                <Input
                  value={camp.description}
                  onChange={(e) =>
                    setCamp({ ...camp, description: e.target.value })
                  }
                />
              </div>

            </div>

            {/* DOCTOR DROPDOWN */}
            <div className="space-y-2">
              <Label>Assign Doctor</Label>

              <select
                className="w-full border rounded p-2"
                onChange={(e) => {
                  const selected = allDoctors.find(
                    (d) => d._id === e.target.value
                  );

                  if (!selected) return;

                  setCamp({
                    ...camp,
                    doctorAssigned: {
                      name: selected.name,
                      email: selected.email,
                    },
                  });
                }}
              >
                <option value="">Select Doctor</option>

                {Array.isArray(allDoctors) &&
                  allDoctors.map((doc) => (
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

                    {Array.isArray(allMedicines) &&
                      allMedicines.map((med) => (
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