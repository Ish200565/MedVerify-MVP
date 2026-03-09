import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Camps(){

const [activeTab,setActiveTab] = useState("schedule")

const upcoming = [
{ name:"Rural Health Camp", location:"Rampur Village", date:"10 Apr 2026", doctors:3 },
{ name:"Eye Checkup Camp", location:"Govt School", date:"14 Apr 2026", doctors:2 },
{ name:"Women Wellness Camp", location:"Community Hall", date:"18 Apr 2026", doctors:4 },
{ name:"Cardiac Screening", location:"City Center", date:"22 Apr 2026", doctors:2 },
{ name:"General Health Camp", location:"Village Panchayat", date:"28 Apr 2026", doctors:3 }
]

const history = [
{ name:"Diabetes Camp", patients:150, critical:18, success:"88%" },
{ name:"Eye Surgery Camp", patients:80, critical:22, success:"93%" },
{ name:"Child Health Camp", patients:120, critical:5, success:"96%" },
{ name:"Orthopedic Camp", patients:95, critical:12, success:"91%" },
{ name:"Skin Disease Camp", patients:110, critical:9, success:"94%" }
]

return(

<div className="space-y-8">

<h1 className="text-3xl font-bold">
Camps Management
</h1>

{/* Tabs */}

<div className="flex gap-4 border-b pb-2">

<button
onClick={()=>setActiveTab("schedule")}
className={`px-4 py-2 rounded-t ${activeTab==="schedule" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
>
Schedule Camp
</button>

<button
onClick={()=>setActiveTab("upcoming")}
className={`px-4 py-2 rounded-t ${activeTab==="upcoming" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
>
Upcoming Camps
</button>

<button
onClick={()=>setActiveTab("history")}
className={`px-4 py-2 rounded-t ${activeTab==="history" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
>
Camp History
</button>

</div>

{/* Schedule Camp */}

{activeTab==="schedule" && (

<Card>

<CardContent className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">

<Input placeholder="Camp Name"/>
<Input placeholder="Location"/>
<Input type="date"/>

<Input placeholder="Assign Doctors"/>
<Input placeholder="Medicines from Inventory"/>

<Button className="lg:col-span-3">
Create Camp
</Button>

</CardContent>

</Card>

)}

{/* Upcoming Camps */}

{activeTab==="upcoming" && (

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

{upcoming.map((camp,i)=>(

<Card key={i} className="hover:shadow-xl transition">

<CardContent className="p-6 space-y-2">

<h3 className="text-lg font-semibold">
{camp.name}
</h3>

<p className="text-sm text-gray-500">
{camp.location}
</p>

<p className="text-sm">
Date: {camp.date}
</p>

<Badge>
{camp.doctors} Doctors Assigned
</Badge>

</CardContent>

</Card>

))}

</div>

)}

{/* Camp History */}

{activeTab==="history" && (

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

{history.map((camp,i)=>(

<Card key={i} className="hover:shadow-xl transition">

<CardContent className="p-6 space-y-2">

<h3 className="text-lg font-semibold">
{camp.name}
</h3>

<p>Patients Checked: {camp.patients}</p>

<p>Critical Cases: {camp.critical}</p>

<Badge variant="secondary">
Success Rate {camp.success}
</Badge>

</CardContent>

</Card>

))}

</div>

)}

</div>

)

}