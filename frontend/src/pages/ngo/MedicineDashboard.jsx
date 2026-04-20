import { useEffect, useState } from "react";
import {
  Menu,
  Search,
  Plus,
  MoreHorizontal,
  Pill,
  Package,
  AlertTriangle,
  Clock,
  Settings,
  LayoutList,
} from "lucide-react";
import API from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import MedBot from "../../components/MedChatbot";
import { Card, CardContent } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

const PAGE_SIZE = 7;

export default function MedicineDashboard() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expiryFilter, setExpiryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

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
      let medicines = Array.isArray(res.data) ? res.data : res.data.data || [];
      setData(medicines);

      let totalStock = 0, lowStock = 0, expiring = 0;
      medicines.forEach((m) => {
        totalStock += m.quantity;
        if (m.quantity < 20) lowStock++;
        const diff = (new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
        if (diff <= 30) expiring++;
      });

      setStats({ totalMedicines: medicines.length, totalStock, lowStock, expiring });
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setSearch("");
    setTypeFilter("all");
    setExpiryFilter("all");
    setStatusFilter("all");
    setPage(1);
  };

  const filtered = data.filter((m) => {
    const matchSearch = m.medicineName.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || m.type?.toLowerCase() === typeFilter;
    const diff = (new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    const matchExpiry = expiryFilter === "all" || diff <= parseInt(expiryFilter);
    const isLow = m.quantity < 20;
    const isExpiring = diff <= 30;
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "low" && isLow) ||
      (statusFilter === "expiring" && !isLow && isExpiring) ||
      (statusFilter === "good" && !isLow && !isExpiring);
    return matchSearch && matchType && matchExpiry && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={open} setOpen={setOpen} />
      <MedBot/>
      <div className="lg:ml-64">
        <Topbar title="Medicine Dashboard" setOpen={setOpen} />

        <div className="p-6 space-y-5 max-w-screen-xl mx-auto">

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Medicines"
              value={stats.totalMedicines}
              icon={<Pill className="w-5 h-5 text-emerald-600" />}
              iconBg="bg-emerald-50"
              border="border-emerald-100"
            />
            <StatCard
              title="Total Stock"
              value={stats.totalStock}
              icon={<Package className="w-5 h-5 text-blue-600" />}
              iconBg="bg-blue-50"
              border="border-blue-100"
            />
            <StatCard
              title="Low Stock"
              value={stats.lowStock}
              valueColor="text-red-500"
              icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
              iconBg="bg-red-50"
              border="border-red-100"
            />
            <StatCard
              title="Expiring Soon"
              value={stats.expiring}
              valueColor="text-amber-500"
              icon={<Clock className="w-5 h-5 text-amber-500" />}
              iconBg="bg-amber-50"
              border="border-amber-100"
            />
          </div>

          {/* INVENTORY CARD */}
          <Card className="rounded-2xl shadow-sm border border-slate-200 bg-white">
            <CardContent className="p-6 space-y-4">

              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">Medicine Inventory</h2>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {/* FILTER BAR */}
              <div className="flex flex-wrap gap-2 items-center">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search medicines..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                  />
                </div>

                <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
                  <SelectTrigger className="w-[130px] h-9 text-sm border-slate-200 rounded-lg">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="capsule">Capsule</SelectItem>
                    <SelectItem value="ointment">Ointment</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={expiryFilter} onValueChange={(v) => { setExpiryFilter(v); setPage(1); }}>
                  <SelectTrigger className="w-[150px] h-9 text-sm border-slate-200 rounded-lg">
                    <SelectValue placeholder="Expiry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Expiry</SelectItem>
                    <SelectItem value="30">Within 30 Days</SelectItem>
                    <SelectItem value="60">Within 60 Days</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                  <SelectTrigger className="w-[120px] h-9 text-sm border-slate-200 rounded-lg">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="expiring">Expiring</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="h-9 px-4 text-sm border-slate-200 rounded-lg"
                >
                  Reset
                </Button>
              </div>

              {/* RECORDS COUNT */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <LayoutList className="w-3.5 h-3.5" />
                Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
              </div>

              {/* TABLE */}
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      {["Name", "Type", "Manufacturer", "Qty", "Expiry", "Status", ""].map((h) => (
                        <TableHead key={h} className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider py-3">
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((m, i) => {
                      const isLow = m.quantity < 20;
                      const diff = (new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
                      const isExpiring = diff <= 30;
                      return (
                        <TableRow key={i} className="hover:bg-slate-50/70 border-slate-100">
                          <TableCell className="py-3 font-medium text-slate-800 text-sm">{m.medicineName}</TableCell>
                          <TableCell className="py-3 text-sm text-slate-500">{m.type}</TableCell>
                          <TableCell className="py-3 text-sm text-slate-500">{m.manufacturer}</TableCell>
                          <TableCell className="py-3 text-sm font-semibold text-slate-700">{m.quantity}</TableCell>
                          <TableCell className="py-3 text-sm text-slate-500">
                            {new Date(m.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </TableCell>
                          <TableCell className="py-3">
                            {isLow ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-600 border border-red-100">Low Stock</span>
                            ) : isExpiring ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">Expiring</span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">Good</span>
                            )}
                          </TableCell>
                          <TableCell className="py-3">
                            <button className="p-1 rounded hover:bg-slate-100">
                              <MoreHorizontal className="w-4 h-4 text-slate-400" />
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {filtered.length === 0 && (
                  <div className="py-12 text-center text-sm text-slate-400">No medicines found</div>
                )}
              </div>

              {/* PAGINATION */}
              {filtered.length > 0 && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="h-8 px-3 text-xs border-slate-200 rounded-lg"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, idx) =>
                        p === "..." ? (
                          <span key={`e-${idx}`} className="px-1 text-slate-400 text-xs">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                              page === p
                                ? "bg-blue-600 text-white"
                                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="h-8 px-3 text-xs border-slate-200 rounded-lg"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, valueColor, icon, iconBg, border }) {
  return (
    <Card className={`rounded-2xl shadow-sm border ${border || "border-slate-200"} bg-white hover:shadow-md transition-shadow`}>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-0.5 font-medium">{title}</p>
          <h2 className={`text-2xl font-bold tracking-tight ${valueColor || "text-slate-800"}`}>{value}</h2>
        </div>
      </CardContent>
    </Card>
  );
}