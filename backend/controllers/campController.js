import Camp from "../models/Camp.js";
import { sendEmail } from "../utils/sendEmail.js";
import Stock from "../models/Stock.js";
import mongoose from "mongoose";
export const addCamp = async (req, res) => {
  try {
    const {
      nameOfCamp,
      date,
      location,
      doctorAssigned,
      medicines,
      description
    } = req.body;

    // ✅ Validate medicines array
    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        message: "Medicines are required"
      });
    }

    // ✅ Validate stock for each medicine
    for (let item of medicines) {

      // ✅ Check valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(item.medicine)) {
        return res.status(400).json({
          message: `Invalid medicine ID: ${item.medicine}`
        });
      }

      // ✅ Fetch all stock entries for that medicine
      const stocks = await Stock.find({
        medicine: new mongoose.Types.ObjectId(item.medicine)
      });

      console.log("Matching stocks:", stocks); // 🔥 debug

      // ✅ Calculate total available stock
      const available = stocks.reduce((sum, s) => sum + s.quantity, 0);

      console.log(`Stock for ${item.medicine}: ${available}`);

      if (available < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for medicine ${item.medicine}`
        });
      }
    }

    // ✅ Create camp
    const newCamp = new Camp({
      nameOfCamp,
      date,
      location,
      doctorAssigned,
      medicines,
      description
    });

    await newCamp.save();

    // ✅ Send Email (non-blocking)
    const message = `
Hello Dr. ${doctorAssigned.name},

You have been assigned to a medical camp.

📌 Camp: ${nameOfCamp}
📅 Date: ${date}
📍 Location: ${location}

Please be available on time.

Regards,  
MedVerify Team
    `;

    sendEmail(
      doctorAssigned.email,
      "New Camp Assignment",
      message
    );

    // ✅ Response
    res.status(201).json({
      success: true,
      message: "Camp created & doctor notified",
      data: newCamp
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getUpcoming_Camps = async (req, res) => {
  try {
    const today = new Date();

    const camps = await Camp.find({
      date: { $gte: today },
      status: "upcoming"
    })
      .populate("medicines.medicine") // 🔥 important
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: camps
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCamp = async (req, res) => {
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
export const getCompletedCamps = async (req, res) => {
  try {
    const camps = await Camp.find({
      status: "completed"
    })
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