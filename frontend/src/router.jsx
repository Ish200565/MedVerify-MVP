import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/landing/Home"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import Doctors from "./pages/ngo/Doctors"
import AddMedicine from "./pages/ngo/AddMedicines"
import MedicineDashboard from "./pages/ngo/MedicineDashboard"
import AddCamp from "./pages/ngo/AddCamp"
import DoctorDashboard from "./pages/doctors/DoctorDashboard" 
import Camps from "./pages/ngo/Camps"
export default function Router() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ngo/doctors" element={<Doctors />} />
        <Route path="/ngo/medicine" element={<MedicineDashboard/>} />
        <Route path="/ngo/add-medicine" element={<AddMedicine/>} />
        <Route path="/ngo/camps" element={<AddCamp/>} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard/>} />
        <Route path="/ngo/show-camps" element={<Camps/>} />
      </Routes>

    </BrowserRouter>
  )
}