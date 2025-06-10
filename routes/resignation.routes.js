// resignation.routes.js
const express = require("express");
const router = express.Router();
const {
  submitResignation,
  getHODResignations,
  approveByHOD,
  rejectByHOD,
  getAdminResignations,
  approveByAdmin,
  rejectByAdmin,
  getSuperAdminResignations,
  approveBySuperAdmin,
  rejectBySuperAdmin,
  getFacultyResignation,
  getHODResignation,
  getAdminResignation,
} = require("../controllers/resignation.controller");

const {
  verifyToken,
  withFaculty,
  withHOD,
  withAdmin,
  withSuperAdmin,
} = require("../withAuth");

// Routes
router.post("/", verifyToken, submitResignation);

router.get("/hod", verifyToken, withHOD, getHODResignations);
router.put("/hod/approve/:id", verifyToken, withHOD, approveByHOD);
router.put("/hod/reject/:id", verifyToken, withHOD, rejectByHOD);

router.get("/admin", verifyToken, withAdmin, getAdminResignations);
router.put("/admin/approve/:id", verifyToken, withAdmin, approveByAdmin);

router.get(
  "/superadmin",
  verifyToken,
  withSuperAdmin,
  getSuperAdminResignations
);
router.put(
  "/superadmin/approve/:id",
  verifyToken,
  withSuperAdmin,
  approveBySuperAdmin
);

router.get("/faculty", verifyToken, withFaculty, getFacultyResignation);
router.get("/hod/status", verifyToken, withHOD, getHODResignation);
router.get("/admin/status", verifyToken, withAdmin, getAdminResignation);

router.put("/admin/reject/:id", verifyToken, withAdmin, rejectByAdmin);

router.put(
  "/superadmin/reject/:id",
  verifyToken,
  withSuperAdmin,
  rejectBySuperAdmin
);

module.exports = router;
