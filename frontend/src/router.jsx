import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/landing/Home"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"

import DashboardLayout from "./components/layout/DashboardLayout"

import NgoDashboard from "./pages/ngo/NgoDashboard"
import MedicineInventory from "./pages/ngo/MedicineInventory"
import Camps from "./pages/ngo/Camps"
import Doctors from "./pages/ngo/Doctors"
import Inbox from "./pages/ngo/Inbox"

export default function Router() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/ngo" element={<DashboardLayout />}>

          <Route index element={<NgoDashboard />} />
          <Route path="inventory" element={<MedicineInventory />} />
          <Route path="camps" element={<Camps />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="inbox" element={<Inbox />} />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}