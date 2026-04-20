const mongoose = require("mongoose");
const campMedicineSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine"
  },
  quantity: Number,


  purpose: String 
});

const campSchema = new mongoose.Schema({
  nameOfCamp: String,
  date: Date,
  location: String,

  doctorAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },

  medicines: [campMedicineSchema],

  description: String,

  status: {
    type: String,
    enum: ["upcoming", "completed"],
    default: "upcoming"
  }

}, { timestamps: true });

module.exports = mongoose.model("Camp", campSchema);
