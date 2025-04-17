var express = require('express');
var router = express.Router();

const withAuth = require('../withAuth');
const organization = require("../controllers/organization.controller.js");

// 📌 Create a new Organization (Only Super Admin & System Admin)
router.post('/', withAuth.verifyToken, withAuth.withSuperAdmin, organization.create);

// 📌 Retrieve a single Organization by ID (Accessible to all authenticated users)
router.get('/:id', withAuth.verifyToken, organization.findOne);

// 📌 Update an Organization (Only Super Admin, System Admin, and Admin)
router.put('/:id', withAuth.verifyToken, withAuth.withHigherRoles, organization.update);

// 📌 Delete an Organization by ID (Only Super Admin & System Admin)
router.delete('/:id', withAuth.verifyToken, withAuth.withAdminOrSystemAdmin, organization.delete);

// 📌 Delete all Organizations (Only Super Admin)
router.delete('/', withAuth.verifyToken, withAuth.withSuperAdmin, organization.deleteAll);

module.exports = router;
