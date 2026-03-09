import DashboardCard from "@/components/dashboard/DashboardCard"
import {
  Package,
  Tent,
  CalendarClock,
  History,
  Users,
  MessageSquare
} from "lucide-react"


export default function NgoDashboard() {

  const cards = [
    {
      title: "Medicine Inventory",
      icon: Package,
      route: "/ngo/inventory",
      description: "Manage medicine stock and expiry"
    },
    {
      title: "Schedule Camps",
      icon: Tent,
      route: "/ngo/camps/schedule",
      description: "Plan and organize health camps"
    },
    {
      title: "Upcoming Camps",
      icon: CalendarClock,
      route: "/ngo/camps/upcoming",
      description: "View upcoming scheduled camps"
    },
    {
      title: "Camp History",
      icon: History,
      route: "/ngo/camps/history",
      description: "Review past camp activities"
    },
    {
      title: "Doctors",
      icon: Users,
      route: "/ngo/doctors",
      description: "View registered doctors"
    },
    {
      title: "Inbox",
      icon: MessageSquare,
      route: "/ngo/inbox",
      description: "Messages from doctors"
    }
  ]

  return (

    <div className="p-6">

      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">


        <div>
          <h1 className="text-3xl font-bold">
            NGO Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Manage camps, medicines and doctors
          </p>
        </div>

      </div>

      {/* DASHBOARD GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {cards.map((card) => (

          <div
            key={card.title}
            className="border rounded-xl shadow-sm hover:shadow-lg transition duration-300 bg-white"
          >
            <DashboardCard {...card} />
          </div>

        ))}

      </div>

    </div>

  )
}