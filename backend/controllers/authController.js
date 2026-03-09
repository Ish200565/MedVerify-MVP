const jwt = require("jsonwebtoken");
const NGO = require("../models/NGO");
const Doctor = require("../models/Doctor");

const generateToken = (id,role)=>{

  return jwt.sign({id,role},process.env.JWT_SECRET,{
    expiresIn:"30d"
  });

};

exports.registerNgo = async (req,res)=>{

  try{

    const ngo = await NGO.create(req.body);

    const token = generateToken(ngo._id,"ngo");

    res.json({
      success:true,
      data:ngo,
      token
    });

  }catch(err){

    res.status(500).json({message:err.message});

  }

};

exports.loginNgo = async (req,res)=>{

  const {email,password} = req.body;

  const ngo = await NGO.findOne({email}).select("+password");

  if(!ngo) return res.status(401).json({message:"Invalid credentials"});

  const match = await ngo.matchPassword(password);

  if(!match) return res.status(401).json({message:"Invalid credentials"});

  const token = generateToken(ngo._id,"ngo");

  res.json({success:true,data:ngo,token});

};

exports.registerDoctor = async (req,res)=>{

  try{

    const ngo = await NGO.findOne({ngoKey:req.body.ngoKey});

    if(!ngo){
      return res.status(400).json({message:"Invalid NGO key"});
    }

    const doctor = await Doctor.create({
      ...req.body,
      ngo:ngo._id
    });

    const token = generateToken(doctor._id,"doctor");

    res.json({success:true,data:doctor,token});

  }catch(err){
    res.status(500).json({message:err.message});
  }

};

exports.loginDoctor = async (req,res)=>{

  const {email,password} = req.body;

  const doctor = await Doctor.findOne({email}).select("+password");

  if(!doctor) return res.status(401).json({message:"Invalid credentials"});

  const match = await doctor.matchPassword(password);

  if(!match) return res.status(401).json({message:"Invalid credentials"});

  const token = generateToken(doctor._id,"doctor");

  res.json({success:true,data:doctor,token});

};

exports.getMe = async (req,res)=>{

  res.json({success:true,data:req.user});

};