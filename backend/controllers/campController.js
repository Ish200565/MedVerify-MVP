const Camp = require("../models/Camp");
const Stock = require("../models/Stock");
const Doctor = require("../models/Doctor");
const mongoose = require("mongoose");
const { sendEmail } = require("../utils/sendEmail");

exports.addCamp = async (req, res) => {
  try {
    const {
      nameOfCamp,
      date,
      location,
      doctorAssigned,
      medicines,
      description
    } = req.body;

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        message: "Medicines are required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorAssigned)) {
      return res.status(400).json({
        message: "Invalid doctor ID"
      });
    }

    const doctor = await Doctor.findById(doctorAssigned);
    if (!doctor) {
      return res.status(404).json({
        message: "Assigned doctor not found"
      });
    }

    for (const item of medicines) {
      if (!mongoose.Types.ObjectId.isValid(item.medicine)) {
        return res.status(400).json({
          message: `Invalid medicine ID: ${item.medicine}`
        });
      }

      const stocks = await Stock.find({
        medicine: new mongoose.Types.ObjectId(item.medicine)
      });

      const available = stocks.reduce((sum, stock) => sum + stock.quantity, 0);

      if (available < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for medicine ${item.medicine}`
        });
      }
    }

    const newCamp = new Camp({
      nameOfCamp,
      date,
      location,
      doctorAssigned: doctor._id,
      medicines,
      description
    });

    await newCamp.save();

    const message = `
Hello Dr. ${doctor.name},

You have been assigned to a medical camp.

Camp: ${nameOfCamp}
Date: ${date}
Location: ${location}

Please be available on time.

Regards,
MedVerify Team
    `;

    sendEmail(doctor.email, "New Camp Assignment", message);

    res.status(201).json({
      success: true,
      message: "Camp created and doctor notified",
      data: newCamp
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUpcoming_Camps = async (req, res) => {
  try {
    const today = new Date();

    const camps = await Camp.find({
      date: { $gte: today },
      status: "upcoming"
    })
      .populate("doctorAssigned", "name email")
      .populate("medicines.medicine")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: camps
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCamp = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCamp = await Camp.findByIdAndDelete(id);

    if (!deletedCamp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    res.status(200).json({
      success: true,
      message: "Camp deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompletedCamps = async (req, res) => {
  try {
    const camps = await Camp.find({
      status: "completed"
    })
      .populate("doctorAssigned", "name email")
      .populate("medicines.medicine")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: camps
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
