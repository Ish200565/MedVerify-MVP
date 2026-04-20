const mongoose = require("mongoose");
const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },

  type: {
    type: String,
    enum: ["Tablet", "Syrup", "Capsule", "Injection", "Ointment"]
  },

  manufacturer: String,

 
  uses: [String],         
  category: String,        
  description: String,

  

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO"
  }

}, { timestamps: true });

module.exports = mongoose.model("Medicine", medicineSchema);
