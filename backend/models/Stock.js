const mongoose = require("mongoose");
const stockSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine"
  },

  unitType: {
    type: String,
    enum: ["Strip", "Bottle", "Vial", "Tube"]
  },
   barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  packSize: Number,
  quantity: Number,

  batchNumber: String,
  expiryDate: Date,

  location: String,

  // 🔥 NEW
  threshold: { type: Number, default: 20 }, // low stock limit

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO"
  }

}, { timestamps: true });

module.exports = mongoose.model("Stock", stockSchema);
