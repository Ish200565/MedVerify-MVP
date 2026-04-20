const jwt = require("jsonwebtoken");
const NGO = require("../models/NGO");
const Doctor = require("../models/Doctor");

const generateToken = (id,role)=>{

  return jwt.sign({id,role},process.env.JWT_SECRET,{
    expiresIn:"30d"
  });

};

exports.registerNgo = async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await NGO.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "NGO already exists" });
    }

    const ngo = await NGO.create(req.body);

    const token = generateToken(ngo._id, "ngo");

    res.json({
      success: true,
      data: ngo,
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
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

exports.registerDoctor = async (req, res) => {
  try {
    const { ngoKey, email } = req.body;

    const ngo = await NGO.findOne({ ngoKey });

    if (!ngo) {
      return res.status(400).json({ message: "Invalid NGO key" });
    }

    const exists = await Doctor.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const doctor = await Doctor.create({
      ...req.body,
      ngo: ngo._id
    });

    const token = generateToken(doctor._id, "doctor");

    res.json({ success: true, data: doctor, token });

  } catch (err) {
    res.status(500).json({ message: err.message });
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

exports.getMe = async (req, res) => {
  try {
    let user;

    if (req.user.role === "ngo") {
      user = await NGO.findById(req.user._id);
    } else {
      user = await Doctor.findById(req.user._id)
        .populate("ngo", "ngoName email");
    }

    res.json({
      success: true,
      data: user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    console.log("USER:", req.user); // 👈 ADD THIS

    const ngoId = req.user?.ngo;

    if (!ngoId) {
      return res.status(400).json({
        message: "NGO ID missing in token"
      });
    }

    const doctors = await Doctor.find({
      ngo: ngoId
    }).select("-password");

    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });

  } catch (error) {
    console.error(error); // 👈 ALSO ADD
    res.status(500).json({
      message: error.message
    });
  }
};