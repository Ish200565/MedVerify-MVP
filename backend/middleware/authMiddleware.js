const jwt = require("jsonwebtoken");
const NGO = require("../models/NGO");
const Doctor = require("../models/Doctor");

exports.protect = async (req,res,next)=>{

  let token;

  if(req.headers.authorization &&
     req.headers.authorization.startsWith("Bearer")){

      token = req.headers.authorization.split(" ")[1];

  }

  if(!token){
    return res.status(401).json({message:"Not authorized"});
  }

  try{

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    if(decoded.role==="ngo"){
      req.user = await NGO.findById(decoded.id);
    }else{
      req.user = await Doctor.findById(decoded.id);
    }

    next();

  }catch(error){
    res.status(401).json({message:"Token failed"});
  }

};