const express = require("express");
const router = express.Router();

const {
registerNgo,
loginNgo,
registerDoctor,
loginDoctor,
getMe,getDoctors
} = require("../controllers/authController");


router.post("/ngo/register",registerNgo);
router.post("/ngo/login",loginNgo);
const { protect, isNGO } = require("../middleware/authMiddleware");
router.get("/ngo/doctors", protect, isNGO, getDoctors);
router.post("/doctor/register",registerDoctor);
router.post("/doctor/login",loginDoctor);

router.get("/me",protect,getMe);

module.exports = router;