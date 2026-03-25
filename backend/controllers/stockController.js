const Stock = require('../models/Stock');

exports.addStock = async (req, res) => {
  try {
    const {
      medicineId,
      unitType,
      packSize,
      quantity,
      batchNumber,
      expiryDate
    } = req.body;

    const stock = new Stock({
      medicine: medicineId,
      unitType,
      packSize,
      quantity,
      batchNumber,
      expiryDate
    });

    await stock.save();

    res.status(201).json(stock);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStock = async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ message: "Stock deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInventory = async (req, res) => {
  try {

    const stocks = await Stock.find()
      .populate("medicine", "name type manufacturer")
      .sort({ expiryDate: 1 });

    const formatted = stocks
      .filter(item => item.medicine !== null) // 🔥 remove broken refs
      .map(item => ({
        medicineName: item.medicine.name,
        type: item.medicine.type,
        manufacturer: item.medicine.manufacturer,
        quantity: item.quantity,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate
      }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};