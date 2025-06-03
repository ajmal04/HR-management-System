const db = require("../models");
const JobRequisition = db.JobRequisition;

// Create a new requisition
exports.createRequisition = async (req, res) => {
  try {
    const { college } = req.user;
    const requisition = await JobRequisition.create({
      ...req.body,
      collegeName: college, // Add this
    });
    res.status(201).json(requisition);
  } catch (error) {
    res.status(500).json({ message: "Failed to create requisition", error });
  }
};

// Get requisitions by admin's college from token
exports.getByAdminCollege = async (req, res) => {
  try {
    const college = req.user.college;
    console.log("Admin College in token:", college);

    const data = await JobRequisition.findAll({
      where: db.Sequelize.where(
        db.Sequelize.fn("LOWER", db.Sequelize.col("collegeName")),
        college.toLowerCase()
      ),
    });

    res.send(data);
  } catch (error) {
    console.error("Error fetching requisitions:", error);
    res.status(500).send({ message: "Error fetching requisitions by college" });
  }
};

// Approve requisition (Admin)
exports.approveRequisitionByAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    await JobRequisition.update(
      { status: "Approved by Admin" },
      { where: { id } }
    );
    res.json({ message: "Requisition approved by admin" });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve requisition" });
  }
};
