// controllers/reportController.js
const Report = require("../models/Report");
const Camp = require("../models/Camp");
const Stock = require("../models/Stock");
const mongoose = require("mongoose");   

exports.addReport = async (req, res) => {
  try {
    const {
      campId,
      totalPeople,
      minorCases,
      majorCases,
      medicinesDistributed,
      doctorReport
    } = req.body;

    // ✅ Validate campId
    if (!mongoose.Types.ObjectId.isValid(campId)) {
      return res.status(400).json({ message: "Invalid camp ID" });
    }

    // ✅ Validate required fields
    if (!totalPeople || !minorCases || !majorCases || !doctorReport) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // ✅ Fetch camp
    const camp = await Camp.findById(campId).populate("doctorAssigned", "name");

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    // ❌ Prevent duplicate report
    const existingReport = await Report.findOne({ camp: campId });
    if (existingReport) {
      return res.status(400).json({
        message: "Report already submitted for this camp"
      });
    }

    // ❌ Prevent reporting on already completed camp
    if (camp.status === "completed") {
      return res.status(400).json({
        message: "Camp already completed"
      });
    }

    // ✅ Create report
    const newReport = new Report({
      camp: campId,

      // snapshot fields
      campName: camp.nameOfCamp,
      location: camp.location,
      doctor: camp.doctorAssigned?._id,

      totalPeople,
      minorCases,
      majorCases,
      medicinesDistributed,
      doctorReport,

      // 🔥 temporary
      successRate: 90
    });

    await newReport.save();

    // ✅ Mark camp completed
    camp.status = "completed";
    await camp.save();
    for (const item of medicinesDistributed || []) {
      await Stock.updateMany(
        { medicine: item.medicine },
        { $inc: { quantity: -item.quantity } }
      );
    }
    // ✅ Populate medicine details
    const populatedReport = await Report.findById(newReport._id)
      .populate({
        path: "medicinesDistributed.medicine",
        select: "name type"
      });

    res.status(201).json({
      success: true,
      message: "Report submitted & camp completed",
      data: populatedReport
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ doctor: req.user._id })
      .populate("camp")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports,
    });

  } catch (error) {
    console.error("GET MY REPORTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.getReportsByCamp = async (req, res) => {
  try {
    const { campId } = req.params;

    const reports = await Report.find({ camp: campId })
      .populate("doctor")
      .populate("camp")
       .populate("medicinesDistributed.medicine", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports,
    });

  } catch (error) {
    console.error("GET REPORTS BY CAMP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};