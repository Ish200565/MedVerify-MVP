const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    enum: ["Tablet", "Syrup", "Capsule", "Injection", "Ointment"],
    required: true
  },

  manufacturer: {
    type: String,
    required: true
  },

  barcode: {
    type: String,
    unique: true,
    sparse: true
  },


  // For future AI/OCR improvements
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO"
  }

}, { timestamps: true });

module.exports = mongoose.model("Medicine", medicineSchema);