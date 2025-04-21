var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");

const department = require("../controllers/department.controller.js");

//  Create a new Department (Only Admin)
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  department.create
);

//  Retrieve all Departments (All authenticated users)
router.get("/", withAuth.verifyToken, department.findAll);

//  Retrieve a single Department with an ID (All authenticated users)
router.get("/:id", withAuth.verifyToken, department.findOne);

//  Update a Department with an ID (Only Admin & System Admin)
router.put(
  "/:id",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  department.update
);

//  Delete a Department with an ID (Only Admin)
router.delete(
  "/:id",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  department.delete
);

//  Delete all Departments (Only Admin)
router.delete(
  "/",
  withAuth.verifyToken,
  withAuth.withHigherRoles,
  department.deleteAll
);

// Retrieve college wise Departments (Admins Department)
router.get(
  "/admin",
  withAuth.verifyToken,
  withAuth.withAdmin,
  department.getDepartmentsByCollege
);

module.exports = router;
