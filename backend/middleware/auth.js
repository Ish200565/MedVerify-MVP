//JWT verification
const jwt=require('jsonwebtoken');
const Doctor=require('../models/Doctor');
const Ngo=require('../models/NGO');

const protect=async(req,res,next)=>{
    let token;
    //Check if token exists in header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return res.status(401).json({message:'Not authorized, no token'});
    }

    try{
        //Verify token
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        //Find user by id and role
        if(decoded.role==='doctor'){
            req.user=await Ngo.findById(decoded.id).select('-password');
        }else{
            req.user=await Doctor.findById(decoded.id).select('-password');
        }
    
     req.user.role = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };