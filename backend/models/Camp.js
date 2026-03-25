// models/Camp.js
const mongoose = require("mongoose");

const campMedicineSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const campSchema = new mongoose.Schema({
  nameOfCamp: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  doctorAssigned: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },

  medicines: {
    type: [campMedicineSchema],
    required: true,
    validate: v => v.length > 0
  },

  description: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    enum: ["upcoming", "completed"],
    default: "upcoming"
  }

}, { timestamps: true });



module.exports = mongoose.model("Camp", campSchema);