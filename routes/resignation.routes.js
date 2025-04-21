const express = require("express");
const router = express.Router();
const db = require("../models");
const Resignation = db.Resignation;
const { Op } = require("sequelize");
const {
  verifyToken,
  withFaculty,
  withHOD,
  withAdmin,
  withSuperAdmin,
} = require("../withAuth");

// POST /api/resignations
router.post("/", verifyToken, async (req, res) => {
  const data = req.body;

  try {
    const role = req.user.role;

    if (role === "ROLE_HOD") {
      data.hodStatus = "approved";
      data.principalStatus = "pending";
      data.hrStatus = "pending";
      data.resignationStatus =
        "Resignation submitted and pending Principal approval.";
    } else if (role === "ROLE_ADMIN") {
      data.hodStatus = "approved";
      data.principalStatus = "approved";
      data.hrStatus = "pending";
      data.resignationStatus =
        "Resignation submitted and pending SuperAdmin approval.";
    } else {
      data.hodStatus = "pending";
      data.principalStatus = "pending";
      data.hrStatus = "pending";
      data.resignationStatus =
        "Resignation submitted and pending HOD approval.";
    }

    await Resignation.create(data);

    res.status(200).json({ message: "Resignation submitted" });
  } catch (error) {
    console.error("Error saving resignation:", error);
    res.status(500).json({ message: "Error submitting resignation" });
  }
});

router.get("/hod", verifyToken, withHOD, async (req, res) => {
  try {
    const { departmentId, college } = req.user;

    const resignations = await db.Resignation.findAll({
      where: {
        departmentId,
        college,
        hodStatus: {
          [db.Sequelize.Op.in]: ["pending", "approved"],
        },
      },
    });

    res.status(200).json(resignations);
  } catch (error) {
    console.error("Error fetching HOD resignations:", error);
    res.status(500).json({ message: "Error fetching resignations." });
  }
});

router.put("/hod/approve/:id", verifyToken, withHOD, async (req, res) => {
  try {
    const resignation = await db.Resignation.findByPk(req.params.id);

    if (!resignation) {
      return res.status(404).json({ message: "Resignation not found." });
    }

    // Update status
    resignation.hodStatus = "approved";
    resignation.resignationStatus =
      (resignation.resignationStatus || "") +
      "\nThe HOD approves the resignation.\nRequest sent to Principal.";
    await resignation.save();

    res.status(200).json({ message: "Approved by HOD" });
  } catch (error) {
    console.error("HOD approval error:", error);
    res.status(500).json({ message: "Failed to approve." });
  }
});
router.put("/hod/reject/:id", verifyToken, withHOD, async (req, res) => {
  try {
    const resignation = await db.Resignation.findByPk(req.params.id);

    if (!resignation) {
      return res.status(404).json({ message: "Resignation not found." });
    }

    resignation.hodStatus = "rejected";
    resignation.resignationStatus += "\nThe HOD rejected the resignation.";
    await resignation.save();

    res.status(200).json({ message: "Resignation rejected by HOD." });
  } catch (error) {
    console.error("HOD rejection error:", error);
    res.status(500).json({ message: "Failed to reject." });
  }
});

router.get("/admin", verifyToken, withAdmin, async (req, res) => {
  try {
    const { college } = req.user;

    const resignations = await db.Resignation.findAll({
      where: {
        college,
        hodStatus: "approved",
        principalStatus: {
          [Op.in]: ["pending", "approved"],
        },
      },
    });

    res.status(200).json(resignations);
  } catch (error) {
    console.error("Error fetching Principal resignations:", error);
    res.status(500).json({ message: "Error fetching data." });
  }
});

router.put("/admin/approve/:id", verifyToken, withAdmin, async (req, res) => {
  try {
    const resignation = await db.Resignation.findByPk(req.params.id);

    if (!resignation) {
      return res.status(404).json({ message: "Resignation not found." });
    }

    resignation.principalStatus = "approved";
    resignation.hrStatus = resignation.hrStatus || "pending";

    resignation.resignationStatus =
      "The Principal approves the resignation.\nRequest sent to HR.";

    await resignation.save();

    res.status(200).json({ message: "Approved by Principal" });
  } catch (error) {
    console.error("Principal approval error:", error);
    res.status(500).json({ message: "Failed to approve." });
  }
});

router.get("/superadmin", verifyToken, withSuperAdmin, async (req, res) => {
  try {
    const resignations = await db.Resignation.findAll({
      where: {
        principalStatus: "approved",
        hrStatus: {
          [Op.in]: ["pending", "approved"],
        },
      },
    });
    console.log("Fetched resignations for SuperAdmin:", resignations.length);
    res.status(200).json(resignations);
  } catch (error) {
    console.error("Error fetching SuperAdmin resignations:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

router.put(
  "/superadmin/approve/:id",
  verifyToken,
  withSuperAdmin,
  async (req, res) => {
    try {
      const resignation = await db.Resignation.findByPk(req.params.id);
      if (!resignation) {
        return res.status(404).json({ message: "Resignation not found." });
      }

      const today = new Date();
      const endDate = new Date(today);
      endDate.setMonth(endDate.getMonth() + 3);

      resignation.hrStatus = "approved";
      resignation.noticeStartDate = today.toISOString().split("T")[0];
      resignation.noticeEndDate = endDate.toISOString().split("T")[0];
      resignation.resignationStatus =
        "The SuperAdmin approves the resignation and notice period was assigned.\nNo leave will be provided during the notice period.";

      await resignation.save();

      res.status(200).json({ message: "Approved by SuperAdmin" });
    } catch (error) {
      console.error("SuperAdmin approval error:", error);
      res.status(500).json({ message: "Failed to approve." });
    }
  }
);

router.get("/faculty", verifyToken, withFaculty, async (req, res) => {
  try {
    const facultyId = req.user.id;

    const resignation = await db.Resignation.findOne({
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
});

module.exports = router;
