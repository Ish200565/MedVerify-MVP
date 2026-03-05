const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add name']
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  ngoKey: {
    type: String,
    required: [true, 'Please add NGO key to register']
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ngo'  // Links to which NGO this doctor belongs
  },
  specialisation: {
    type: String,
    required: [true, 'Please add specialisation']
  },
  experience: {
    type: Number,  // Years of experience
    required: [true, 'Please add years of experience']
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number']
  },
  role: {
    type: String,
    default: 'doctor'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
DoctorSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password
DoctorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Doctor', DoctorSchema);

// How It Works:
// NGO Admin Registers:
//   → Creates account
//   → Gets auto-generated ngoKey (e.g., "RED-847291")
//   → Shares this key with doctors

// Doctor Registers:
//   → Enters the ngoKey they received
//   → Backend verifies key exists
//   → Links doctor to that NGO