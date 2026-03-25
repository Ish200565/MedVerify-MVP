import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function Topbar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
      
      <h2 className="text-xl font-semibold">Medicines Dashboard</h2>

      <div className="flex items-center gap-4">
        
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Dr. Rajesh</span>
        </div>

      </div>
    </div>
  );
}