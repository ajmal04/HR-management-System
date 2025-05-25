const db = require("../models");
const JobRequisition = db.jobRequisition;

exports.createRequisition = async (req, res) => {
  try {
    const {
      jobTitle,
      department,
      vacancies,
      jobType,
      qualification,
      experience,
      reason,
    } = req.body;
    const newReq = await JobRequisition.create({
      jobTitle,
      department,
      vacancies,
      jobType,
      qualification,
      experience,
      reason,
      createdBy: req.user.id,
    });
    res.status(201).json(newReq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRequisitions = async (req, res) => {
  try {
    const requisitions = await JobRequisition.findAll();
    res.json(requisitions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveRequisition = async (req, res) => {
  try {
    const reqId = req.params.id;
    const updated = await JobRequisition.update(
      { status: "Approved" },
      { where: { id: reqId } }
    );
    res.json({ message: "Requisition Approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get only approved and posted jobs
exports.getPublicJobs = async (req, res) => {
  try {
    const jobs = await db.JobRequisition.findAll({
      where: { status: ["Approved", "Posted"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Candidate applies to a job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, name, email, phone, education, experience } = req.body;

    const application = await db.JobApplication.create({
      jobId,
      name,
      email,
      phone,
      education,
      experience,
      resumePath: "placeholder.pdf", // resume handling later
      status: "Pending",
    });

    res.status(201).json({ message: "Application submitted!", application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
