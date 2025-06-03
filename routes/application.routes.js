var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");

const application = require("../controllers/application.controller.js");

// 📌 Retrieve all applications (Admin & Manager only)
router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  application.findAll
);

router.get(
  "/college",
  withAuth.verifyToken,
  withAuth.withAdmin,
  application.getApplicationsByCollege
);

// 📌 Create a new Application (Any authenticated user can apply)
router.post("/", withAuth.verifyToken, application.create);

// 📌 Retrieve all Applications by User Id (Admin, Manager & User itself)
router.get("/user/:id", withAuth.verifyToken, application.findAllByUserId);

// 📌 Retrieve all Applications by Department Id (Manager only)
router.get(
  "/department/:id",
  withAuth.verifyToken,
  withAuth.withHOD,
  application.findAllByDeptId
);

// 📌 Retrieve Recent Applications (2 weeks old) (Admin & Manager only)
router.get(
  "/recent",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  application.findAllRecent
);

// 📌 Retrieve Recent Applications by Department (Manager only)
router.get(
  "/recent/department/:id",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  application.findAllRecentAndDept
);

// 📌 Retrieve Recent Applications by User (Admin & User itself)
router.get(
  "/recent/user/:id",
  withAuth.verifyToken,
  application.findAllRecentAndUser
);

// 📌 Retrieve a single Application (Admin & User itself)
router.get("/:id", withAuth.verifyToken, application.findOne);

// 📌 Update an Application (Admin & Manager only)
router.put(
  "/:id",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  application.update
);

// 📌 Delete all Applications (Only Admin)
router.delete(
  "/",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  application.deleteAll
);

// 📌 Delete a single Application (Admin & Manager only)
router.delete(
  "/:id",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  application.delete
);

// 📌 Delete all Applications by User Id (Only Admin)
router.delete(
  "/user/:id",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  application.deleteAllByUserId
);

// ✅ HOD updates status
router.put(
  "/hod/approve/:id",
  withAuth.verifyToken,
  withAuth.withHOD,
  application.hodUpdate
);

// ✅ Admin updates status
router.put(
  "/admin/approve/:id",
  withAuth.verifyToken,
  withAuth.withAdmin,
  application.adminUpdate
);

module.exports = router;
