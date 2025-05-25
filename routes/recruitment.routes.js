const express = require("express");
const router = express.Router();
const recruitmentController = require("../controllers/recruitment.controller");
const { withAuth } = require("../withAuth");

// HOD or Principal creates requisition
router.post(
  "/requisitions",
  withAuth(["hod", "admin"]),
  recruitmentController.createRequisition
);

// HR/Admin fetches requisitions
router.get(
  "/requisitions",
  withAuth(["admin", "superadmin"]),
  recruitmentController.getAllRequisitions
);

// HR/Admin approves requisition
router.put(
  "/requisitions/:id/approve",
  withAuth(["admin", "superadmin"]),
  recruitmentController.approveRequisition
);

// Public job listings
router.get("/jobs/openings", recruitmentController.getPublicJobs);

// Apply to a job (no auth for public)
router.post("/jobs/apply", recruitmentController.applyToJob);

module.exports = router;
