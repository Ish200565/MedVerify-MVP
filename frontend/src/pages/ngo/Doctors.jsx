import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const doctors = [
{
name:"Dr Rahul Sharma",
specialisation:"Cardiologist",
degree:"MBBS, MD",
age:42,
experience:"15 yrs",
image:"https://i.pravatar.cc/300?img=11"
},
{
name:"Dr Neha Gupta",
specialisation:"Dermatologist",
degree:"MBBS, MD",
age:35,
experience:"10 yrs",
image:"https://i.pravatar.cc/300?img=32"
},
{
name:"Dr Amit Verma",
specialisation:"Orthopedic",
degree:"MBBS, MS",
age:38,
experience:"12 yrs",
image:"https://i.pravatar.cc/300?img=52"
},
{
name:"Dr Priya Nair",
specialisation:"Gynecologist",
degree:"MBBS, DGO",
age:40,
experience:"14 yrs",
image:"https://i.pravatar.cc/300?img=47"
}
]

export default function Doctors(){

return(

<div className="max-w-7xl mx-auto p-6 space-y-8">

{/* HEADER */}

<div className="text-center sm:text-left">

<h1 className="text-3xl font-bold">
Doctors Directory
</h1>

<p className="text-sm text-muted-foreground">
Verified doctors associated with your NGO
</p>

</div>


{/* DOCTOR GRID */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

{doctors.map((doc,i)=>(

<Card
key={i}
className="border shadow-sm hover:shadow-lg transition duration-300 rounded-xl"
>

<CardContent className="p-6 flex flex-col items-center text-center gap-4">

{/* AVATAR */}

<Avatar className="w-24 h-24 border shadow-sm">

<AvatarImage
src={doc.image}
className="object-cover"
/>

<AvatarFallback>
{doc.name.split(" ")[1][0]}
</AvatarFallback>

</Avatar>


{/* NAME + SPECIALISATION */}

<div>

<h3 className="font-semibold text-lg">
{doc.name}
</h3>

<Badge variant="secondary" className="mt-2">
{doc.specialisation}
</Badge>

</div>


{/* DETAILS */}

<div className="text-sm text-muted-foreground space-y-1">

<p>{doc.degree}</p>
<p>Age: {doc.age}</p>
<p>{doc.experience} experience</p>

</div>

</CardContent>

</Card>

))}

</div>

</div>

)

}