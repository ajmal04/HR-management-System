const express = require("express");
const router = express.Router();
const withAuth = require("../withAuth");

const controller = require("../controllers/collegeEvent.controller");

// Create a new College Event (SuperAdmin only)
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  controller.create
);

// Get all College Events (Accessible by users of the same college)
router.get("/", withAuth.verifyToken, controller.findAll);

// Get recent College Events (Visible in dashboard widgets, etc.)
router.get("/recent", withAuth.verifyToken, controller.findRecent);

// Delete College Event by ID (SuperAdmin only)
router.delete(
  "/:id",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  controller.delete
);

module.exports = router;
