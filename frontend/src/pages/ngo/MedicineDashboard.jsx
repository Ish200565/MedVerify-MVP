import { useEffect, useState } from "react";
import {
  Menu,
  Search,
  Plus,
  MoreHorizontal,
  Bell,
  Settings,
  Pill,
  Package,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  LayoutList,
} from "lucide-react";
import API from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";

import { Card, CardContent } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
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

      let totalStock = 0,
        lowStock = 0,
        expiring = 0;

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

    const matchType =
      typeFilter === "all" || m.type?.toLowerCase() === typeFilter;

    const diff = (new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    const matchExpiry =
      expiryFilter === "all" || diff <= parseInt(expiryFilter);

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
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar open={open} setOpen={setOpen} />

      {/* TOPBAR */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-base font-semibold text-gray-800 tracking-tight">
            Medicine Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 ml-1">
            <img
              src="https://i.pravatar.cc/32"
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-6 space-y-5 max-w-screen-xl mx-auto">

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Medicines"
            value={stats.totalMedicines}
            icon={<Pill className="w-6 h-6 text-emerald-600" />}
            iconBg="bg-emerald-100"
          />
          <StatCard
            title="Total Stock"
            value={stats.totalStock}
            icon={<Package className="w-6 h-6 text-blue-600" />}
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStock}
            valueColor="text-red-500"
            icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
            iconBg="bg-red-100"
          />
          <StatCard
            title="Expiring Soon"
            value={stats.expiring}
            valueColor="text-orange-500"
            icon={<Clock className="w-6 h-6 text-orange-500" />}
            iconBg="bg-orange-100"
          />
        </div>

        {/* INVENTORY CARD */}
        <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
          <CardContent className="p-6 space-y-4">

            {/* CARD HEADER */}
            <h2 className="text-base font-semibold text-gray-800">
              Medicine Inventory
            </h2>

            {/* FILTER BAR */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Type */}
              <Select
                value={typeFilter}
                onValueChange={(v) => { setTypeFilter(v); setPage(1); }}
              >
                <SelectTrigger className="w-[140px] h-9 text-sm border-gray-200 rounded-lg">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="capsule">Capsule</SelectItem>
                  <SelectItem value="ointment">Ointment</SelectItem>
                </SelectContent>
              </Select>

              {/* Expiry */}
              <Select
                value={expiryFilter}
                onValueChange={(v) => { setExpiryFilter(v); setPage(1); }}
              >
                <SelectTrigger className="w-[170px] h-9 text-sm border-gray-200 rounded-lg">
                  <SelectValue placeholder="All Expiry Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expiry Dates</SelectItem>
                  <SelectItem value="30">Within 30 Days</SelectItem>
                  <SelectItem value="60">Within 60 Days</SelectItem>
                </SelectContent>
              </Select>

              {/* Status search-style combo */}
              <div className="relative flex items-center border border-gray-200 rounded-lg h-9 px-3 gap-2 bg-white min-w-[240px] flex-1">
                <span className="text-sm text-gray-500 whitespace-nowrap">Status –</span>
                <Select
                  value={statusFilter}
                  onValueChange={(v) => { setStatusFilter(v); setPage(1); }}
                >
                  <SelectTrigger className="border-0 shadow-none h-auto p-0 text-sm text-gray-700 focus:ring-0 flex-1">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="expiring">Expiring</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                  </SelectContent>
                </Select>
                <Search className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
              </div>

              {/* Reset */}
              <Button
                variant="default"
                onClick={handleReset}
                className="h-9 px-4 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Reset
              </Button>

              {/* Settings icon */}
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* TABLE HEADER ROW */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <LayoutList className="w-4 h-4" />
                <span>
                  Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
                </span>
              </div>
            </div>

            {/* TABLE */}
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide py-3">Name</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide py-3">Type</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide py-3">Manufacturer</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide py-3">Quantity</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide py-3">Expiry</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide py-3">Status</TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginated.map((m, i) => {
                    const isLow = m.quantity < 20;
                    const diff = (new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
                    const isExpiring = diff <= 30;

                    return (
                      <TableRow
                        key={i}
                        className="hover:bg-gray-50/70 transition-colors border-gray-100"
                      >
                        <TableCell className="py-3.5 font-medium text-gray-800 text-sm">
                          {m.medicineName}
                        </TableCell>
                        <TableCell className="py-3.5 text-sm text-gray-600">{m.type}</TableCell>
                        <TableCell className="py-3.5 text-sm text-gray-600">{m.manufacturer}</TableCell>
                        <TableCell className="py-3.5 text-sm text-gray-700 font-medium">{m.quantity}</TableCell>
                        <TableCell className="py-3.5 text-sm text-gray-600">
                          {new Date(m.expiryDate).toLocaleDateString("en-US", {
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="py-3.5">
                          {isLow ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                              Low Stock
                            </span>
                          ) : isExpiring ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100">
                              Expiring
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-600 border border-green-100">
                              Good
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-gray-400">
                  No medicines found
                </div>
              )}
            </div>

            {/* PAGINATION */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm text-gray-500">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-8 px-3 text-sm border-gray-200 rounded-lg"
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
                        <span key={`ellipsis-${idx}`} className="px-1 text-gray-400 text-sm">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            page === p
                              ? "bg-blue-600 text-white"
                              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
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
                    className="h-8 px-3 text-sm border-gray-200 rounded-lg"
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
  );
}

/* STAT CARD */
function StatCard({ title, value, valueColor, icon, iconBg }) {
  return (
    <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-0.5">{title}</p>
          <h2 className={`text-2xl font-bold tracking-tight ${valueColor || "text-gray-800"}`}>
            {value}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}