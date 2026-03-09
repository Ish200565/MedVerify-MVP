import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import logo from "../assets/logoo.PNG";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <nav className="w-full h-16 bg-white border-b px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center h-full">
        <img
          src={logo}
          alt="MedVerify Logo"
          className="h-10 md:h-12 w-auto object-contain"
        />
      </div>

      {/* User section */}
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback className="bg-blue-600 text-white">
            {localStorage.getItem("ngoName")?.charAt(0).toUpperCase() || "N"}
          </AvatarFallback>
        </Avatar>

        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-black transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
