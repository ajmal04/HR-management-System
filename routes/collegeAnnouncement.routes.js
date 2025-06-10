const express = require("express");
const router = express.Router();
const withAuth = require("../withAuth");

const controller = require("../controllers/collegeAnnouncement.controller.js");

// POST /api/collegeAnnouncements
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  controller.create
);

// GET /api/collegeAnnouncements
router.get("/", withAuth.verifyToken, controller.findAll);

// GET /api/collegeAnnouncements/recent
router.get("/recent", withAuth.verifyToken, controller.findRecent);

// DELETE /api/collegeAnnouncements/:id
router.delete(
  "/:id",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  controller.delete
);

module.exports = router;
