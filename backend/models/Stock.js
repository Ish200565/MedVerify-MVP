const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({

  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true
  },

  unitType: {
    type: String,
    enum: ["Strip", "Bottle", "Vial", "Tube"],
    required: true
  },

  packSize: {
    type: Number, // e.g. 10 tablets per strip
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  batchNumber: {
    type: String,
    required: true
  },

  expiryDate: {
    type: Date,
    required: true
  },


  location: {
    type: String
  },

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });



stockSchema.index(
  { medicine: 1, batchNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("Stock", stockSchema);