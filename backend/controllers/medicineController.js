const Medicine = require("../models/Medicine");


// ✅ CREATE MEDICINE (NGO scoped)
exports.createMedicine = async (req, res) => {
  try {
    const ngoId = req.user.ngo;

    const { name, type, manufacturer } = req.body;

    const existing = await Medicine.findOne({
      name,
      createdBy: ngoId   // 🔥 IMPORTANT
    });

    if (existing) {
      return res.status(400).json({
        message: "Medicine already exists"
      });
    }

    const medicine = await Medicine.create({
      name,
      type,
      manufacturer,
      createdBy: ngoId   // ✅ LINK TO NGO
    });

    res.status(201).json({
      success: true,
      data: medicine
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ GET ALL MEDICINES (ONLY THIS NGO)
exports.getMedicine = async (req, res) => {
  try {
    const ngoId = req.user.ngo;

    const medicines = await Medicine.find({
      createdBy: ngoId   // 🔥 FILTER
    });

    res.json({
      success: true,
      count: medicines.length,
      data: medicines
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ DELETE MEDICINE (SAFE)
exports.deleteMedicine = async (req, res) => {
  try {
    const ngoId = req.user.ngo;

    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      createdBy: ngoId   // 🔥 SECURITY
    });

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found"
      });
    }

    res.json({
      success: true,
      message: "Medicine deleted"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};