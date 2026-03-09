export default function DoctorDashboard(){

return(

<div className="min-h-screen bg-gray-100">

<header className="flex justify-between items-center bg-white shadow p-4">

<h1 className="text-xl font-bold text-blue-600">
MedVerify
</h1>

<div className="w-10 h-10 bg-gray-300 rounded-full"></div>

</header>

<div className="p-10 grid md:grid-cols-3 gap-6">

<div className="card">
Camps Assigned
</div>

<div className="card">
Send Camp Report
</div>

<div className="card">
Message NGO
</div>

</div>

</div>

);
}