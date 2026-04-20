const jwt = require("jsonwebtoken");
const NGO = require("../models/NGO");
const Doctor = require("../models/Doctor");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", decoded);
    let user;

    if (decoded.role === "ngo") {
      user = await NGO.findById(decoded.id);

      req.user = {
        _id: user._id,
        role: "ngo",
        ngo: user._id   // ✅ NGO itself
      };

    } else {
      user = await Doctor.findById(decoded.id);

      req.user = {
        _id: user._id,
        role: "doctor",
        ngo: user.ngo   // ✅ IMPORTANT
      };
    }

    next();

  } catch (error) {
    return res.status(401).json({ message: "Token failed" });
  }
};
exports.isNGO = (req, res, next) => {
  if (req.user.role !== "ngo") {
    return res.status(403).json({ message: "NGO access only" });
  }
  next();
};

exports.isDoctor = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Doctor access only" });
  }
  next();
};