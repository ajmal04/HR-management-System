var express = require('express');
var router = express.Router();

const withAuth = require("../withAuth");

const college = require("../controllers/college.controller.js");

//  Retrieve all Colleges (All authenticated users)
router.get('/', withAuth.verifyToken, college.getColleges);

router.get('/users', withAuth.verifyToken, withAuth.withAdmin, college.getUsersFromSameCollege);

module.exports = router;
