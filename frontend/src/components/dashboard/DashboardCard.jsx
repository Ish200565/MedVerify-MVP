import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export default function DashboardCard({ title, icon: Icon, route, description }) {

  const navigate = useNavigate()

  return (

    <Card
      onClick={() => navigate(route)}
      className="cursor-pointer hover:shadow-xl transition hover:scale-[1.03]"
    >

      <CardHeader className="flex flex-row items-center gap-4">

        <Icon size={32} className="text-blue-600"/>

        <CardTitle>{title}</CardTitle>

      </CardHeader>

      <CardContent>

        <p className="text-sm text-muted-foreground">
          {description}
        </p>

      </CardContent>

    </Card>

  )
}