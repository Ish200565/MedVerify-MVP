const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const doctorSchema = new mongoose.Schema({

  name: String,

  email:{
    type:String,
    unique:true
  },

  password:{
    type:String,
    required:true,
    select:false
  },

  ngoKey:String,

  ngo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"NGO"
  },

  specialisation:String,

  experience:Number,

  phone:String

});

doctorSchema.pre("save", async function(next){

  if(!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password,salt);

});

doctorSchema.methods.matchPassword = async function(password){

  return await bcrypt.compare(password,this.password);

};

module.exports = mongoose.model("Doctor",doctorSchema);