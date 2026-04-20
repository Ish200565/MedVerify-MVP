require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const stockRoutes = require("./routes/stockRoutes");
const campRoutes = require("./routes/campRoutes");
const reportRoutes = require("./routes/reportRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/medicines",medicineRoutes);
app.use("/api/stocks",stockRoutes);
app.use("/api/camps",campRoutes);
app.use("/api/reports",reportRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chatbot", require("./routes/chatbot.route"));
app.get("/",(req,res)=>{
  res.send("MedVerify API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});