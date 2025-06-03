const express = require("express");
const router = express.Router();
const requisitionController = require("../controllers/jobRequisition.controller");
const withAuth = require("../withAuth");

// Create requisition (HOD)
router.post("/", requisitionController.createRequisition);

// Get requisitions by admin's college (uses token)
router.get(
  "/college",
  withAuth.verifyToken,
  withAuth.withAdmin,
  requisitionController.getByAdminCollege
);

// Admin approves requisition
router.put(
  "/approve/admin/:id",
  withAuth.verifyToken,
  withAuth.withAdmin,
  requisitionController.approveRequisitionByAdmin
);

module.exports = router;
