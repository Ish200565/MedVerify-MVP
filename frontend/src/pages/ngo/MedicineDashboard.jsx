import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import API from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";

/* shadcn */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export default function MedicineDashboard() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalStock: 0,
    lowStock: 0,
    expiring: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/stocks/inventory");

      let medicines = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setData(medicines);

      let totalStock = 0;
      let lowStock = 0;
      let expiring = 0;

      medicines.forEach((m) => {
        totalStock += m.quantity;
        if (m.quantity < 20) lowStock++;

        const diff =
          (new Date(m.expiryDate) - new Date()) /
          (1000 * 60 * 60 * 24);

        if (diff <= 30) expiring++;
      });

      setStats({
        totalMedicines: medicines.length,
        totalStock,
        lowStock,
        expiring,
      });
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
          <h2 className="text-lg font-semibold">Medicine Dashboard</h2>
        </div>

      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-6">

        {/* STATS */}
        <div className="grid border-solid border-[1px] border-gray-700 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

          <Stat title="Total Medicines" value={stats.totalMedicines} />
          <Stat title="Total Stock" value={stats.totalStock} />
          <Stat title="Low Stock" value={stats.lowStock} color="text-red-500" />
          <Stat title="Expiring Soon" value={stats.expiring} color="text-orange-500" />

        </div>

      

        {/* TABLE */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Medicine Inventory</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((m, i) => {
                  const isLow = m.quantity < 20;

                  const diff =
                    (new Date(m.expiryDate) - new Date()) /
                    (1000 * 60 * 60 * 24);

                  const isExpiring = diff <= 30;

                  return (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {m.medicineName}
                      </TableCell>
                      <TableCell>{m.type}</TableCell>
                      <TableCell>{m.manufacturer}</TableCell>
                      <TableCell>{m.quantity}</TableCell>
                      <TableCell>
                        {new Date(m.expiryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {isLow && (
                          <Badge variant="destructive">
                            Low Stock
                          </Badge>
                        )}

                        {!isLow && isExpiring && (
                          <Badge className="bg-orange-100 text-orange-600">
                            Expiring
                          </Badge>
                        )}

                        {!isLow && !isExpiring && (
                          <Badge className="bg-green-100 text-green-600">
                            Good
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {data.length === 0 && (
              <p className="text-center mt-4 text-gray-500">
                No medicines found
              </p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

/* STAT CARD */
function Stat({ title, value, color }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className={`text-2xl font-bold ${color || ""}`}>
          {value}
        </h2>
      </CardContent>
    </Card>
  );
}