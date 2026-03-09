import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import {
Table,
TableHeader,
TableRow,
TableHead,
TableBody,
TableCell
} from "@/components/ui/table"

import {
Card,
CardHeader,
CardTitle,
CardContent
} from "@/components/ui/card"

export default function MedicineInventory(){

const [showMedicines,setShowMedicines] = useState(false)

const [form,setForm] = useState({
name:"",
batch:"",
manufacturer:"",
exp:"",
stock:""
})

const [medicines,setMedicines] = useState([
{
name:"Paracetamol",
batch:"A123",
manufacturer:"Cipla",
exp:"2026-05-01",
stock:400
},
{
name:"Amoxicillin",
batch:"B765",
manufacturer:"Sun Pharma",
exp:"2023-01-10",
stock:20
}
])

const handleChange = (e)=>{
setForm({
...form,
[e.target.name]: e.target.value
})
}

const addMedicine = ()=>{

if(!form.name) return

setMedicines([...medicines,form])

setForm({
name:"",
batch:"",
manufacturer:"",
exp:"",
stock:""
})

}

const isExpired = (date)=>{
return new Date(date) < new Date()
}

return(

<div className="w-full max-w-6xl mx-auto space-y-8 p-4 sm:p-6">

{/* HEADER */}

<div className="text-center sm:text-left">

<h1 className="text-2xl sm:text-3xl font-bold">
Medicine Inventory
</h1>

<p className="text-gray-500 text-sm">
Manage NGO medicine stock and expiry tracking
</p>

</div>


{/* ADD MEDICINE */}

<Card>

<CardHeader>
<CardTitle className="text-center sm:text-left">
Add New Medicine
</CardTitle>
</CardHeader>

<CardContent>

<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

<Input
name="name"
placeholder="Medicine Name"
value={form.name}
onChange={handleChange}
/>

<Input
name="batch"
placeholder="Batch Number"
value={form.batch}
onChange={handleChange}
/>

<Input
name="manufacturer"
placeholder="Manufacturer"
value={form.manufacturer}
onChange={handleChange}
/>

<Input
type="date"
name="exp"
value={form.exp}
onChange={handleChange}
/>

<Input
name="stock"
placeholder="Stock Quantity"
value={form.stock}
onChange={handleChange}
/>

<Button
onClick={addMedicine}
className="w-full"
>
Add Medicine
</Button>

</div>

</CardContent>

</Card>


{/* SHOW MEDICINES BUTTON */}

<div className="flex justify-center sm:justify-start">

<Button
variant="outline"
onClick={()=>setShowMedicines(!showMedicines)}
>
{showMedicines ? "Hide Medicines" : "Show Medicines"}
</Button>

</div>


{/* MEDICINES LIST */}

{showMedicines && (

<Card className=" shadow-sm">

<CardHeader>
<CardTitle>Medicine List</CardTitle>
</CardHeader>

<CardContent>


{/* DESKTOP TABLE */}

<div className="hidden md:block overflow-x-auto">

<Table>

<TableHeader>
<TableRow>

<TableHead>Name</TableHead>
<TableHead>Batch</TableHead>
<TableHead>Manufacturer</TableHead>
<TableHead>Expiry</TableHead>
<TableHead>Stock</TableHead>
<TableHead>Status</TableHead>

</TableRow>
</TableHeader>

<TableBody>

{medicines.map((med,i)=>{

const expired = isExpired(med.exp)

return(

<TableRow key={i} className="hover:bg-gray-50">

<TableCell className="font-medium">
{med.name}
</TableCell>

<TableCell>
{med.batch}
</TableCell>

<TableCell>
{med.manufacturer}
</TableCell>

<TableCell>
{med.exp}
</TableCell>

<TableCell>
{med.stock}
</TableCell>

<TableCell>

{expired ? (
<Badge variant="destructive">
Expired
</Badge>
) : (
<Badge variant="secondary">
Active
</Badge>
)}

</TableCell>

</TableRow>

)

})}

</TableBody>

</Table>

</div>


{/* MOBILE CARD VIEW */}

<div className="grid gap-4 md:hidden">

{medicines.map((med,i)=>{

const expired = isExpired(med.exp)

return(

<Card key={i} className="shadow-sm border">

<CardContent className="p-4 space-y-2 text-center">

<div className="flex justify-between items-center">

<span className="font-semibold">
{med.name}
</span>

{expired ? (
<Badge variant="destructive">
Expired
</Badge>
) : (
<Badge variant="secondary">
Active
</Badge>
)}

</div>

<p className="text-sm text-gray-500">
Batch: {med.batch}
</p>

<p className="text-sm text-gray-500">
Manufacturer: {med.manufacturer}
</p>

<p className="text-sm text-gray-500">
Expiry: {med.exp}
</p>

<p className="text-sm text-gray-500">
Stock: {med.stock}
</p>

</CardContent>

</Card>

)

})}

</div>


</CardContent>

</Card>

)}

</div>

)

}