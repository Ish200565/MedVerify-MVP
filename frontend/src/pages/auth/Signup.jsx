import { useState } from "react";
import API from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";

import logo from "../../assets/logoo.PNG";

export default function Signup() {

  const [role, setRole] = useState("ngo");
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
    "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
    "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
  ];

  const specialisations = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Gynecologist",
    "Psychiatrist"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    try {

      const endpoint =
        role === "ngo"
          ? "/auth/ngo/register"
          : "/auth/doctor/register";

      const res = await API.post(endpoint, form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.data.role);

      if (res.data.data.role === "ngo") {
        navigate("/ngo/dashboard");
      } else {
        navigate("/doctor/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }

  };

  return (

    <div className="h-screen grid md:grid-cols-2 bg-white overflow-hidden">

      {/* LEFT SIDE FORM */}
      <div className="flex items-center justify-center">

        <div className="w-full max-w-sm space-y-4">

          <h2 className="text-2xl font-bold text-center">
            Create Account
          </h2>

          {/* ROLE */}
          <Select value={role} onValueChange={setRole}>

            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>

            <SelectContent className="bg-white border shadow-lg z-50">

              <SelectItem value="ngo">NGO</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>

            </SelectContent>

          </Select>

          <Input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />

          <Input
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          {/* NGO FIELDS */}
          {role === "ngo" && (
            <>
              <Input
                name="ngoName"
                placeholder="NGO Name"
                onChange={handleChange}
              />

              <Select
                onValueChange={(value) =>
                  setForm({ ...form, state: value })
                }
              >

                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>

                <SelectContent className="bg-white border shadow-lg z-50">

                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}

                </SelectContent>

              </Select>

              <Input
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
              />
            </>
          )}

          {/* DOCTOR FIELDS */}
          {role === "doctor" && (
            <>
              <Input
                name="ngoKey"
                placeholder="NGO Key"
                onChange={handleChange}
              />

              <Select
                onValueChange={(value) =>
                  setForm({ ...form, specialisation: value })
                }
              >

                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Doctor Specialisation" />
                </SelectTrigger>

                <SelectContent className="bg-white border shadow-lg z-50">

                  {specialisations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}

                </SelectContent>

              </Select>

              <Input
                type="number"
                name="experience"
                placeholder="Experience (Years)"
                onChange={handleChange}
              />
            </>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            Register
          </Button>

          <p className="text-sm text-center text-gray-600">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

      {/* RIGHT SIDE LOGO */}
      <div className="hidden md:flex items-center justify-center bg-gray-50">

        <img
          src={logo}
          alt="MedVerify"
          className="w-64 object-contain"
        />

      </div>

    </div>

  );
}