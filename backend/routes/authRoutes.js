const express = require("express");
const router = express.Router();

const {
registerNgo,
loginNgo,
registerDoctor,
loginDoctor,
getMe,getDoctors
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/ngo/register",registerNgo);
router.post("/ngo/login",loginNgo);
router.get("/ngo/doctors",getDoctors);
router.post("/doctor/register",registerDoctor);
router.post("/doctor/login",loginDoctor);

router.get("/me",protect,getMe);

module.exports = router;