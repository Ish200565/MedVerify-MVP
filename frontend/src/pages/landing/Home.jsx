import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import logo from "../../assets/logo_med.png";
import side from "../../assets/MedVerify.png";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

import bg from "../../assets/medverify_backk.png";

const lineData = [
  { year: "2021", patients: 8 },
  { year: "2022", patients: 18 },
  { year: "2023", patients: 20 },
  { year: "2024", patients: 32 },
  { year: "2025", patients: 36 },
];

const barData = [
  { name: "Jan", stock: 40 },
  { name: "Feb", stock: 30 },
  { name: "Mar", stock: 20 },
  { name: "Apr", stock: 15 },
];

const features = [
  {
    title: "Easy Inventory",
    description: "Track medicines in real-time and monitor expiry dates effortlessly."
  },
  {
    title: "Secure Access",
    description: "JWT-based authentication ensures only authorized users access data."
  },
  {
    title: "Verified NGOs",
    description: "Only registered NGOs can manage and verify medicine inventories."
  }
];

const steps = [
  {
    number: "1",
    title: "Sign Up",
    description: "Register your NGO account quickly and securely."
  },
  {
    number: "2",
    title: "Add Medicines",
    description: "Enter medicine name, manufacturer, quantity and expiry date."
  },
  {
    number: "3",
    title: "Dashboard Overview",
    description: "Monitor medicine inventory and expiry dates from one dashboard."
  }
];

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 overflow-x-hidden">

      {/* FLOATING NAVBAR */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 
        w-[90%] max-w-6xl 
        flex items-center justify-between px-8 py-3
        bg-white/70 backdrop-blur-lg 
        border border-white/40
        rounded-full shadow-md z-50">

        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="h-12" />
        </div>

        <div className="hidden md:flex gap-10 text-base font-medium">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
          <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
        </div>

        <Link to="/login">
          <Button className="rounded-full px-6">Get Started</Button>
        </Link>
      </nav>


      {/* HERO SECTION */}
      <section
        className="relative h-screen w-full flex items-center justify-center text-center px-6"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* LIGHT OVERLAY */}
        <div className="absolute inset-0 bg-white/30" />

        {/* LEFT GRAPH */}
        <div className="hidden lg:block absolute left-10 bottom-20 w-64 h-40 opacity-90">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={false} />
              <Bar dataKey="stock" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RIGHT GRAPH */}
        <div className="hidden lg:block absolute right-10 bottom-20 w-64 h-40 opacity-90">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="year" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={false} />
              <Line
                type="monotone"
                dataKey="patients"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* HERO CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mt-16"
        >
          <Link
            to="/login"
            className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Get yourself login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mt-6">
            Cloud-Powered Platform
          </h1>

          <h2 className="text-3xl md:text-5xl text-blue-600 mt-4 font-semibold">
            for Tracking Medicine & Camps
          </h2>

          <p className="mt-6 text-gray-700 text-lg max-w-2xl mx-auto">
            Smart healthcare analytics with real-time tracking, predictive insights,
            and seamless NGO medicine management.
          </p>

          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link to="/signup">
              <Button size="lg" className="rounded-2xl px-8">
                Get Started
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-2xl px-8">
              Learn More
            </Button>
          </div>
        </motion.div>
      </section>


      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-white">
        <motion.div
          className="max-w-6xl mx-auto px-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose MedVerify?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Designed specifically for NGOs to manage medicine inventories securely and efficiently.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600 group-hover:scale-110 transition" />
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>


      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <motion.div
          className="max-w-6xl mx-auto px-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with MedVerify in three simple steps.
            </p>
          </motion.div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={slideInLeft}
                className="group relative flex gap-8 p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-xl group-hover:bg-blue-700 transition">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>


      {/* DETAILED FEATURE SECTIONS */}
      {/* Section 1: Easy Inventory */}
      <section className="px-6 py-24 grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Real-time Inventory Management
          </h2>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            Track every medicine in your inventory with real-time updates. Monitor stock levels, 
            expiry dates, and get instant alerts when medicines are running low. Our system ensures 
            no medicine is wasted and every shipment is properly documented.
          </p>
          <Button className="mt-8 rounded-2xl px-8">Learn More</Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="rounded-2xl shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <img src={side} alt="inventory" className="w-full h-full object-cover rounded-2xl" />
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Section 2: Secure Access */}
      <section className="px-6 py-24 grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="order-2 md:order-1"
        >
          <Card className="rounded-2xl shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <img src={side} alt="security" className="w-full h-full object-cover rounded-2xl" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="order-1 md:order-2"
        >
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Enterprise-Grade Security
          </h2>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            Your data is protected with JWT-based authentication and encrypted connections. 
            Only authorized NGO staff can access sensitive medicine inventory information. 
            Every action is logged for complete audit trails and compliance.
          </p>
          <Button className="mt-8 rounded-2xl px-8">See How</Button>
        </motion.div>
      </section>

      {/* Section 3: Verified NGOs */}
      <section className="px-6 py-24 grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Trusted by NGOs Worldwide
          </h2>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            Join a community of verified NGOs managing their medicine inventories with confidence. 
            Our verification process ensures only legitimate organizations can use our platform. 
            Build credibility while making healthcare more accessible.
          </p>
          <Button className="mt-8 rounded-2xl px-8">Join Our Network</Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="rounded-2xl shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <img src={side} alt="ngos" className="w-full h-full object-cover rounded-2xl" />
            </CardContent>
          </Card>
        </motion.div>
      </section>


      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <motion.div
          className="max-w-4xl mx-auto px-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-blue-100">
              Have questions? Our team is here to help your NGO succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <Mail className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <a href="mailto:support@medverify.com" className="text-blue-100 hover:text-white transition">
                support@medverify.com
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <Phone className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <a href="tel:+1-800-MED-VERIFY" className="text-blue-100 hover:text-white transition">
                +1-800-MED-VERIFY
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <MapPin className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-blue-100">
                Global Support<br />Available 24/7
              </p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20"
          >
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/50 transition"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/50 transition"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/50 transition"
              />
              <textarea
                placeholder="Your Message"
                rows="5"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/50 transition resize-none"
              />
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-lg py-3 font-semibold transition">
                Send Message
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>


      {/* CTA SECTION */}
      <section className="py-24 bg-white text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your NGO's Medicine Management?
          </h2>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of NGOs already using MedVerify to track and manage their medicine inventories effectively.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/signup">
              <Button size="lg" className="rounded-2xl px-8">
                Create Your Account
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-2xl px-8">
              Schedule Demo
            </Button>
          </div>
        </motion.div>
      </section>


      {/* FOOTER */}
      <footer className="py-12 bg-gray-900 text-gray-300 text-center border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
          <div className="text-left">
            <img src={logo} alt="logo" className="h-10 mb-4" />
            <p className="text-sm text-gray-400">
              Smart healthcare management for NGOs worldwide.
            </p>
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Security</a></li>
            </ul>
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
              <li><a href="#" className="hover:text-white transition">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-sm">
            © {new Date().getFullYear()} MedVerify. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}