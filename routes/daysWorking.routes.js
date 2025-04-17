var express = require('express');
var router = express.Router();

const withAuth = require("../withAuth");

const daysWorking = require("../controllers/daysWorking.controller.js");

// 📌 Create a new Working Day (Only Admin & HOD)
router.post('/', withAuth.verifyToken, withAuth.withAdminOrHOD, daysWorking.create);

// 📌 Retrieve all Working Days (All authenticated users)
router.get('/', withAuth.verifyToken, daysWorking.findAll);

// 📌 Retrieve a single Working Day by ID (All authenticated users)
router.get('/:id', withAuth.verifyToken, daysWorking.findOne);

// 📌 Delete a Working Day by ID (Only Admin & HOD)
router.delete('/:id', withAuth.verifyToken, withAuth.withAdminOrHOD, daysWorking.delete);

// 📌 Delete all Working Days (Only Admin)
router.delete('/', withAuth.verifyToken, withAuth.withAdmin, daysWorking.deleteAll);

module.exports = router;
