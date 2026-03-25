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

import logo from "../../assets/logoo.png";

export default function Login() {

  const [role, setRole] = useState("ngo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const endpoint =
        role === "ngo"
          ? "/auth/ngo/login"
          : "/auth/doctor/login";

      const res = await API.post(endpoint, { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

      if (role === "ngo") {
        navigate("/ngo/medicine");
      } else {
        navigate("/doctor/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }

  };

  return (

    <div className="h-screen grid md:grid-cols-2 bg-white overflow-hidden">

      {/* LEFT SIDE FORM */}
      <div className="flex items-center justify-center">

        <div className="w-full max-w-sm space-y-4">

          <h2 className="text-2xl font-bold text-center">
            Login to your account
          </h2>

          {/* ROLE SELECT */}
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
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            onClick={handleLogin}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            Login
          </Button>

          <p className="text-sm text-center text-gray-600">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="font-semibold hover:underline"
            >
              Register
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