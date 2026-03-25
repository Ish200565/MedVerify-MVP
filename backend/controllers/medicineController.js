const Medicine = require("../models/Medicine");

exports.getMedicineByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    const medicine = await Medicine.findOne({ barcode });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json(medicine);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMedicine = async (req, res) => {
  try {
    const { name, type, manufacturer, barcode } = req.body;

    const existing = await Medicine.findOne({ barcode });

    if (existing) {
      return res.status(400).json({ message: "Medicine already exists" });
    }

    const medicine = new Medicine({
      name,
      type,
      manufacturer,
      barcode
    });

    await medicine.save();

    res.status(201).json(medicine);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: "Medicine deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMedicine= async (req, res) => {
  try {
    const medicines = await Medicine.find();  
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};