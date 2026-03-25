
const express = require("express");
const { addCamp, getUpcoming_Camps, deleteCamp,getCompletedCamps } = require("../controllers/campController");
const router = express.Router();


router.post("/add", addCamp);
router.get("/completed", getCompletedCamps);

router.get("/upcoming", getUpcoming_Camps);


router.delete("/delete/:id", deleteCamp);

module.exports = router;