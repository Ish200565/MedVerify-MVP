import { Menu, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo_med.png";
export default function Topbar({ title, setOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className=" top-0 z-40 flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm lg:ml-64">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
        >
          <Menu className="w-5 h-5" />
        </button>
        
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1">
        {/* Logo visible on desktop topbar */}
        <div className="hidden lg:flex items-center mr-4">
         <img src={logo} alt="MedVerify" className="h-7 w-auto " />
        </div>

        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 ml-1 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}