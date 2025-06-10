const express = require("express");
const router = express.Router();
const withAuth = require("../withAuth");

const controller = require("../controllers/departmentEvent.controller");

// Create a new Department Event (HOD/Admin only)
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  controller.create
);

// Get all Department Events for a College (Admin only)
router.get(
  "/college",
  withAuth.verifyToken,
  withAuth.withAdmin,
  controller.getCollegeEvents
);

// Get all Department Events by Department ID (HOD/Faculty)
router.get("/department/:id", withAuth.verifyToken, controller.findAllByDeptId);

// Delete Department Event by ID (HOD/Admin)
router.delete(
  "/:id",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  controller.delete
);

module.exports = router;
