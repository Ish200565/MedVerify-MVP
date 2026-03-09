const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const generateNgoKey = require("../utils/generateNgoKey");

const ngoSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  ngoName: {
    type: String,
    required: true
  },

  state: String,

  phone: String,

  email: {
    type: String,
    unique: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  ngoKey: {
    type: String,
    unique: true,
    default: generateNgoKey
  }

});

ngoSchema.pre("save", async function(next){

  if(!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password,salt);

});

ngoSchema.methods.matchPassword = async function(password){

  return await bcrypt.compare(password,this.password);

};

module.exports = mongoose.model("NGO",ngoSchema);