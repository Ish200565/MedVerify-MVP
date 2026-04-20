import { X, Pill, PlusCircle, Tent, MapPin, Stethoscope, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo_med.png";
const NAV_ITEMS = [
  { to: "/ngo/medicine",     label: "Medicines",     icon: Pill },
  { to: "/ngo/add-medicine", label: "Add Medicine",  icon: PlusCircle },
  { to: "/ngo/camps",        label: "Camps",         icon: Tent },
  { to: "/ngo/show-camps",   label: "Your Camps",    icon: MapPin },
  { to: "/ngo/doctors",      label: "Doctors",       icon: Stethoscope },
];

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* LOGO */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="MedVerify" className="h-8 w-auto" />
        </div>
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Navigation
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all group"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:text-red-500" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE SLIDE-IN */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* DESKTOP PERSISTENT */}
      <div className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 z-30">
        <SidebarContent />
      </div>
    </>
  );
}