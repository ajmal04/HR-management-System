const db = require("../models");
const Resignation = db.Resignation;
const { Op } = require("sequelize");

exports.submitResignation = async (req, res) => {
  const data = req.body;

  try {
    const role = req.user.role;

    if (role === "ROLE_HOD") {
      data.hodStatus = "approved";
      data.principalStatus = "pending";
      data.hrStatus = "pending";
    } else if (role === "ROLE_ADMIN") {
      data.hodStatus = "approved";
      data.principalStatus = "approved";
      data.hrStatus = "pending";
    } else {
      data.hodStatus = "pending";
      data.principalStatus = "pending";
      data.hrStatus = "pending";
    }

    await Resignation.create(data);
    res.status(200).json({ message: "Resignation submitted" });
  } catch (error) {
    console.error("Error saving resignation:", error);
    res.status(500).json({ message: "Error submitting resignation" });
  }
};

exports.getHODResignations = async (req, res) => {
  try {
    const { departmentId, college } = req.user;
    const statusFilter = ["pending", "approved", "rejected"];

    const resignations = await Resignation.findAll({
      where: {
        departmentId,
        college,
        hodStatus: {
          [Op.in]: statusFilter,
        },
      },
    });

    res.status(200).json(resignations);
  } catch (error) {
    console.error("Error fetching HOD resignations:", error);
    res.status(500).json({ message: "Error fetching resignations." });
  }
};

exports.approveByHOD = async (req, res) => {
  try {
    const resignation = await Resignation.findByPk(req.params.id);
    if (!resignation) {
      return res.status(404).json({ message: "Resignation not found." });
    }
    resignation.hodStatus = "approved";
    await resignation.save();
    res.status(200).json({ message: "Approved by HOD" });
  } catch (error) {
    console.error("HOD approval error:", error);
    res.status(500).json({ message: "Failed to approve." });
  }
};

exports.rejectByHOD = async (req, res) => {
  try {
    const resignation = await Resignation.findByPk(req.params.id);
    if (!resignation) {
      return res.status(404).json({ message: "Resignation not found." });
    }
    resignation.hodStatus = "rejected";
    resignation.hodComment = req.body.comment || "";
    await resignation.save();
    res.status(200).json({ message: "Resignation rejected by HOD." });
  } catch (error) {
    console.error("HOD rejection error:", error);
    res.status(500).json({ message: "Failed to reject." });
  }
};

exports.getAdminResignations = async (req, res) => {
  try {
    const { college } = req.user;
    const statusFilter = ["pending", "approved", "rejected"];

    const resignations = await Resignation.findAll({
      where: {
        college,
        hodStatus: "approved",
        principalStatus: {
          [Op.in]: statusFilter,
        },
      },
    });

    res.status(200).json(resignations);
  } catch (error) {
    console.error("Error fetching Principal resignations:", error);
    res.status(500).json({ message: "Error fetching data." });
  }
};

exports.approveByAdmin = async (req, res) => {
  try {
    const resignation = await Resignation.findByPk(req.params.id);
    if (!resignation) {
      return res.status(404).json({ message: "Resignation not found." });
    }

    resignation.principalStatus = "approved";
    resignation.hrStatus = resignation.hrStatus || "pending";

    await resignation.save();
    res.status(200).json({ message: "Approved by Principal" });
  } catch (error) {
    console.error("Principal approval error:", error);
    res.status(500).json({ message: "Failed to approve." });
  }
};

exports.rejectByAdmin = async (req, res) => {
  try {
    const resignation = await Resignation.findByPk(req.params.id);
    if (!resignation)
      return res.status(404).json({ message: "Resignation not found." });

    resignation.principalStatus = "rejected";
    resignation.principalComment = req.body.comment || "";
    await resignation.save();

    res.status(200).json({ message: "Rejected by Principal with reason." });
  } catch (error) {
    console.error("Admin rejection error:", error);
    res.status(500).json({ message: "Failed to reject." });
  }
};

exports.getSuperAdminResignations = async (req, res) => {
  try {
    const statusFilter = ["pending", "approved", "rejected"];

    const resignations = await Resignation.findAll({
      where: {
        principalStatus: "approved",
        hrStatus: {
          [Op.in]: statusFilter,
        },
      },
    });

    res.status(200).json(resignations);
  } catch (error) {
    console.error("Error fetching SuperAdmin resignations:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

exports.approveBySuperAdmin = async (req, res) => {
  try {
    const resignation = await Resignation.findByPk(req.params.id);
    if (!resignation) {
      return res.status(404).json({ message: "Resignation not found." });
    }

    const leaveDays = req.body.leaveDays || 0;
    const today = new Date();
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 3);
    endDate.setDate(endDate.getDate() + leaveDays);

    resignation.hrStatus = "approved";
    resignation.noticeStartDate = today.toISOString().split("T")[0];
    resignation.noticeEndDate = endDate.toISOString().split("T")[0];
    resignation.resignationStatus =
      `The SuperAdmin approves the resignation and notice period was assigned.\nNo leave will be provided during the notice period.` +
      (leaveDays > 0
        ? `\n${leaveDays} leave day(s) taken during notice period have been added.`
        : "");

    await resignation.save();

    res.status(200).json({ message: "Approved by SuperAdmin" });
  } catch (error) {
    console.error("SuperAdmin approval error:", error);
    res.status(500).json({ message: "Failed to approve." });
  }
};

exports.rejectBySuperAdmin = async (req, res) => {
  try {
    const resignation = await Resignation.findByPk(req.params.id);
    if (!resignation) {
      return res.status(404).json({ message: "Resignation not found." });
    }

    resignation.hrStatus = "rejected";
    resignation.hrComment = req.body.comment || "";
    await resignation.save();

    res.status(200).json({ message: "Rejected by SuperAdmin with reason." });
  } catch (error) {
    console.error("SuperAdmin rejection error:", error);
    res.status(500).json({ message: "Failed to reject." });
  }
};

exports.getFacultyResignation = async (req, res) => {
  try {
    const facultyId = req.user.id;

    const resignation = await Resignation.findOne({
      where: { employeeId: facultyId },
    });

    if (!resignation) {
      return res.status(404).json({ message: "No resignation found." });
    }

    res.status(200).json(resignation);
  } catch (error) {
    console.error("Error fetching faculty resignation:", error);
    res.status(500).json({ message: "Failed to fetch resignation status." });
  }
};

exports.getHODResignation = async (req, res) => {
  try {
    const hodId = req.user.id;
    const resignation = await Resignation.findOne({
      where: { employeeId: hodId },
    });

    if (!resignation) {
      return res.status(404).json({ message: "No resignation found." });
    }

    res.status(200).json(resignation);
  } catch (error) {
    console.error("Error fetching HOD resignation:", error);
    res.status(500).json({ message: "Failed to fetch resignation status." });
  }
};

exports.getAdminResignation = async (req, res) => {
  try {
    const adminId = req.user.id;
    const resignation = await Resignation.findOne({
      where: { employeeId: adminId },
    });

    if (!resignation) {
      return res.status(404).json({ message: "No resignation found." });
    }

    res.status(200).json(resignation);
  } catch (error) {
    console.error("Error fetching Admin resignation:", error);
    res.status(500).json({ message: "Failed to fetch resignation status." });
  }
};
