// models/Report.js

const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Camp",
    required: true
  },

  // Snapshot fields (so report stays fixed even if camp changes)
  campName: String,
  location: String,
  doctorAssigned: String,
  campDescription: String,

  totalPeople: {
    type: Number,
    required: true
  },

  minorCases: {
    type: Number,
    required: true
  },

  majorCases: {
    type: Number,
    required: true
  },

  medicinesDistributed: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine"
      },
      quantity: Number
    }
  ],

  doctorReport: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500
  },

  doctorScore: {
    type: Number // from ML microservice (0–1)
  },

  successRate: {
    type: Number // final percentage
  }

}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);