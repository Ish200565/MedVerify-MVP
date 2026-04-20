const Report = require("../models/Report");
const Medicine = require("../models/Medicine");

exports.queryAI = async (req, res) => {
  try {
    const ngoId = req.user.ngo;

    /* ================= FETCH DATA ================= */
    const reports = await Report.find({ ngo: ngoId }).populate("camp");

    let totalPatients = 0;
    let minor = 0;
    let major = 0;

    const medicineMap = {};

    reports.forEach((r) => {
      totalPatients += Number(r.totalPeople) || 0;
      minor += Number(r.minorCases) || 0;
      major += Number(r.majorCases) || 0;

      if (r.medicinesDistributed?.length) {
        r.medicinesDistributed.forEach((m) => {
          const key = m.medicine?.toString();
          if (!key) return;

          medicineMap[key] = (medicineMap[key] || 0) + (m.quantity || 0);
        });
      }
    });

    /* ================= FETCH MEDICINE NAMES ================= */
    const meds = await Medicine.find({
      _id: { $in: Object.keys(medicineMap) },
      createdBy: ngoId,
    });

    const medicineUsage = meds.map((m) => ({
      name: m.name,
      quantity: medicineMap[m._id] || 0,
    }));

    /* ================= SORT TOP MEDICINES ================= */
    medicineUsage.sort((a, b) => b.quantity - a.quantity);

    const successRate =
      totalPatients > 0
        ? Math.round((minor / totalPatients) * 100)
        : 0;

    /* ================= SIMPLE RESPONSE ================= */
    const aiResponse = {
      answer: `Total ${totalPatients} patients treated across camps. ${minor} minor and ${major} major cases recorded with a success rate of ${successRate}%.`,
      insights: [
        medicineUsage.length
          ? `${medicineUsage[0].name} is the most used medicine`
          : "No medicine usage data available",
        minor > major
          ? "Most cases are minor"
          : "Major cases are significant and need attention",
      ],
      suggestions: [
        "Ensure proper medicine stock for frequently used medicines",
        "Focus on reducing major cases through early diagnosis",
      ],
    };

    /* ================= FINAL RESPONSE ================= */
    res.json({
      ai: aiResponse,
      stats: {
        totalPatients,
        minorCases: minor,
        majorCases: major,
        successRate,
      },
      charts: {
        medicineUsage,
        caseDistribution: [
          { name: "Minor", value: minor },
          { name: "Major", value: major },
        ],
      },
    });

  } catch (err) {
    console.error("ERROR:", err.message);

    res.status(500).json({
      error: "Failed to process data",
    });
  }
};