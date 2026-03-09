import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import side from "../../assets/MedVerify.png";

export default function Home() {

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="font-sans text-gray-900">

      {/* HERO SECTION */}
      <section className="w-full flex flex-col md:flex-row min-h-screen">

        {/* LEFT TEXT */}
        <motion.div
          className="md:w-1/2 flex flex-col justify-center items-center px-6 md:px-16 py-16 text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          {/* Login Pill */}
          <Link
            to="/login"
            className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Get yourself login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-6">
            Cloud-Powered Platform for{" "}
            <span className="text-purple-500">Tracking Medicine</span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-xl text-lg text-gray-600">
            A secure and intuitive platform designed to help NGOs manage
            and verify their medicine inventories. Track quantities and
            monitor expiry dates easily.
          </p>

          {/* Button */}
          <Link
            to="/signup"
            className="mt-8 px-8 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition"
          >
            Get Started
          </Link>

        </motion.div>

  
 {/* RIGHT IMAGE */}
<div className="relative md:w-1/2 flex justify-center items-center overflow-hidden">

  <img
    src={side}
    alt="MedVerify"
    className="w-64 sm:w-80 md:w-full md:h-full object-contain md:object-cover"
  />

  {/* Smooth Gradient Transition */}
  <div className="hidden md:block absolute -left-8 top-0 h-full w-64 pointer-events-none
    bg-gradient-to-r from-white via-white/70 to-transparent">
  </div>

</div>

      </section>

      {/* FEATURES */}
      <section className="py-24 bg-gray-50">

        <motion.div
          className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >

          <motion.div
            variants={fadeUp}
            className="p-8 bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-3">
              Easy Inventory
            </h3>
            <p className="text-gray-600">
              Track medicines in real-time and monitor expiry dates effortlessly.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="p-8 bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-3">
              Secure Access
            </h3>
            <p className="text-gray-600">
              JWT-based authentication ensures only authorized users access data.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="p-8 bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-3">
              Verified NGOs
            </h3>
            <p className="text-gray-600">
              Only registered NGOs can manage and verify medicine inventories.
            </p>
          </motion.div>

        </motion.div>

      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">

        <motion.div
          className="max-w-5xl mx-auto px-6 space-y-8"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >

          <motion.div
            variants={fadeUp}
            className="p-8 bg-blue-50 rounded-xl shadow"
          >
            <h3 className="text-xl font-semibold">
              1. Sign Up
            </h3>
            <p className="text-gray-700 mt-2">
              Register your NGO account quickly and securely.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="p-8 bg-blue-50 rounded-xl shadow"
          >
            <h3 className="text-xl font-semibold">
              2. Add Medicines
            </h3>
            <p className="text-gray-700 mt-2">
              Enter medicine name, manufacturer, quantity and expiry date.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="p-8 bg-blue-50 rounded-xl shadow"
          >
            <h3 className="text-xl font-semibold">
              3. Dashboard Overview
            </h3>
            <p className="text-gray-700 mt-2">
              Monitor medicine inventory and expiry dates from one dashboard.
            </p>
          </motion.div>

        </motion.div>

      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50 text-center px-6">

        <h2 className="text-3xl font-semibold mb-6">
          Ready to simplify your NGO’s medicine management?
        </h2>

        <Link
          to="/signup"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create Your Account
        </Link>

      </section>

      {/* FOOTER */}
      <footer className="py-6 bg-white text-center text-gray-500 border-t">
        © {new Date().getFullYear()} MedVerify — All rights reserved.
      </footer>

    </div>
  );
}