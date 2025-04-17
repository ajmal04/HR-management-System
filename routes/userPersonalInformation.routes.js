var express = require('express');
var router = express.Router();

const withAuth = require("../withAuth");
const personalInformation = require("../controllers/userPersonalInformation.controller.js");

// ✅ Create a new User Personal Information (Only Admins)
router.post('/', withAuth.verifyToken, withAuth.withHigherRoles, personalInformation.create);

// ✅ Retrieve User Personal Information by User Id (Only Admin OR the User themselves)
router.get('/user/:id', withAuth.verifyToken, withAuth.withAdminOrSelf, personalInformation.findAllByUserId);

// ✅ Retrieve a single User Personal Information with an id (Only Admin OR the User themselves)
router.get('/:id', withAuth.verifyToken, withAuth.withAdminOrSelf, personalInformation.findOne);

// ✅ Update a User Personal Information with an id (Only Admin OR the User themselves)
router.put('/:id', withAuth.verifyToken, withAuth.withHigherRoles, personalInformation.update);

// ✅ Delete a User Personal Information with an id (Only Admins)
router.delete('/:id', withAuth.verifyToken, withAuth.withAdmin, personalInformation.delete);

// ✅ Delete all User Personal Information (Only Admins)
router.delete('/', withAuth.verifyToken, withAuth.withAdmin, personalInformation.deleteAll);

module.exports = router;
