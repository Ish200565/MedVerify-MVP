import { X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* OVERLAY BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">MedVerify</h2>
          <X className="cursor-pointer" onClick={() => setOpen(false)} />
        </div>

        {/* MENU */}
        <nav className="p-4 space-y-2 text-sm">
          <Link
            to="/ngo/medicine"
            onClick={() => setOpen(false)}
            className="block p-2 rounded border hover:bg-gray-100"
          >
            Medicines
          </Link>

          <Link
            to="/ngo/add-medicine"
            onClick={() => setOpen(false)}
            className="block p-2 rounded border hover:bg-gray-100"
          >
            Add Medicines
          </Link>

          <Link
            to="/ngo/camps"
            onClick={() => setOpen(false)}
            className="block p-2 rounded border hover:bg-gray-100"
          >
            Camps
          </Link>
            <Link
            to="/ngo/show-camps"
          
            onClick={() => setOpen(false)}
            className="block p-2 rounded border hover:bg-gray-100"
          >
            Your Camps
          </Link>
          <Link
            to="/ngo/doctors"
            onClick={() => setOpen(false)}
            className="block p-2 rounded border hover:bg-gray-100"
          >
            Doctors
          </Link>
        </nav>
      </div>
    </>
  );
}