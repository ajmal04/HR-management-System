var express = require('express');
var router = express.Router();

const withAuth = require("../withAuth");

const daysHoliday = require("../controllers/daysHoliday.controller.js");

// 📌 Create a new Holiday Date (Only Admin & HOD)
router.post('/', withAuth.verifyToken, withAuth.withAdminOrHOD, daysHoliday.create);

// 📌 Retrieve all Holiday Dates (All authenticated users)
router.get('/', withAuth.verifyToken, daysHoliday.findAll);

// 📌 Retrieve a single Holiday Date by ID (All authenticated users)
router.get('/:id', withAuth.verifyToken, daysHoliday.findOne);

// 📌 Delete a Holiday Date by ID (Only Admin & HOD)
router.delete('/:id', withAuth.verifyToken, withAuth.withAdminOrHOD, daysHoliday.delete);

// 📌 Delete all Holiday Dates (Only Admin)
router.delete('/', withAuth.verifyToken, withAuth.withAdmin, daysHoliday.deleteAll);

module.exports = router;
