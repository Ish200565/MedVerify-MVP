const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema({
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Camp"
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },

  // Snapshot
  campName: String,
  location: String,

  totalPeople: Number,
  minorCases: Number,
  majorCases: Number,

  medicinesDistributed: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine"
      },
      quantity: Number
    }
  ],

  // 🧠 Doctor input
  doctorReport: {
    type: String,
    required: true
  },

  // 🔥 AI GENERATED FIELDS
  commonDiseases: [String],       // ["fever", "infection"]
  recommendations: String,        // "Increase ORS stock"
  alerts: [String],               // ["ORS shortage"]

  doctorScore: Number,
  successRate: Number

}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
