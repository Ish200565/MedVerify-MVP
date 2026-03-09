import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const notifications = [
{
title:"Camp Report Submitted",
doctor:"Dr. Rahul Sharma",
message:"Submitted the health camp report for Mumbai camp.",
time:"2 min ago"
},
{
title:"Medicine Request",
doctor:"Dr. Neha Gupta",
message:"Requested additional Paracetamol stock for upcoming camp.",
time:"10 min ago"
},
{
title:"Camp Completed",
doctor:"Dr. Amit Verma",
message:"Orthopedic checkup camp completed successfully.",
time:"1 hour ago"
},
{
title:"New Patient Update",
doctor:"Dr. Priya Nair",
message:"Shared patient statistics from yesterday's camp.",
time:"3 hours ago"
}
]

export default function Inbox(){

return(

<div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">

{/* HEADER */}

<div className="text-center sm:text-left">

<h1 className="text-3xl font-bold">
Notifications
</h1>

<p className="text-sm text-muted-foreground">
Updates from doctors and health camps
</p>

</div>


{/* NOTIFICATIONS */}

<div className="space-y-4">

{notifications.map((note,i)=>(

<Card
key={i}
className="border shadow-sm hover:shadow-md transition rounded-xl bg-white"
>

<CardContent className="flex items-start gap-4 p-4">

{/* Avatar */}

<Avatar className="w-10 h-10">

<AvatarFallback>
{note.doctor.split(" ")[1][0]}
</AvatarFallback>

</Avatar>

{/* Notification Content */}

<div className="flex-1 space-y-1">

<div className="flex justify-between items-center flex-wrap gap-2">

<h3 className="font-semibold text-sm sm:text-base">
{note.title}
</h3>

<Badge variant="secondary" className="text-xs">
{note.time}
</Badge>

</div>

<p className="text-sm text-muted-foreground">
{note.doctor}
</p>

<p className="text-sm">
{note.message}
</p>

</div>

</CardContent>

</Card>

))}

</div>

</div>

)

}