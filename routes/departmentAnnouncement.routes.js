var express = require('express');
var router = express.Router();

const withAuth = require('../withAuth');

const departmentAnnouncement = require("../controllers/departmentAnnouncement.controller.js");

// Create a new Department Announcement (Only Admin & HOD)
router.post('/', withAuth.verifyToken, withAuth.withHigherRoles, departmentAnnouncement.create);

// Retrieve all Announcements (All authenticated users)
router.get('/', withAuth.verifyToken, departmentAnnouncement.findAll);

router.get('/college', withAuth.verifyToken, withAuth.withAdmin, departmentAnnouncement.getCollegeAnnouncements);

// 📌 Retrieve recent Announcements (All authenticated users)
router.get('/recent', withAuth.verifyToken, departmentAnnouncement.findAllRecent);

// 📌 Retrieve recent Announcements by Department ID (All authenticated users)
router.get('/recent/department/:id', withAuth.verifyToken, departmentAnnouncement.findAllRecentByDeptId);

// 📌 Retrieve all Announcements of a Department with Department ID (All authenticated users)
router.get('/department/:id', withAuth.verifyToken, departmentAnnouncement.findAllByDeptId);

// 📌 Retrieve a single Department Announcement with an ID (All authenticated users)
router.get('/:id', withAuth.verifyToken, departmentAnnouncement.findOne);

// 📌 Delete a Department Announcement with an ID (Only Admin)
router.delete('/:id', withAuth.verifyToken, withAuth.withHigherRoles, departmentAnnouncement.delete);

// 📌 Delete all Department Announcements by Department ID (Only Admin)
router.delete('/department/:id', withAuth.verifyToken, withAuth.withHigherRoles, departmentAnnouncement.deleteAllByDeptId);

module.exports = router;
