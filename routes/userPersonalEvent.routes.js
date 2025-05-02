var express = require('express');
var router = express.Router();

const withAuth = require("../withAuth");
const personalEvent = require("../controllers/userPersonalEvent.controller.js");

// ✅ Create a new Personal Event (Authenticated Users)
router.post('/', withAuth.verifyToken, personalEvent.create);   

// ✅ Retrieve all Personal Events by User Id (Only Admins OR the User themselves)
router.get('/user/:id', withAuth.verifyToken, withAuth.withAdminOrSelf, personalEvent.findAllByUserId);

// ✅ Retrieve a single Personal Event with an id (Only Admins OR the Event Owner)
router.get('/:id', withAuth.verifyToken, withAuth.withAdminOrSelf, personalEvent.findOne);

// ✅ Update a Personal Event with an id (Only Admins OR the Event Owner)
router.put('/:id', withAuth.verifyToken, withAuth.withHigherRoles, personalEvent.update);

// ✅ Delete a Personal Event with an id (Admins OR the Event Owner)
router.delete('/:id', withAuth.verifyToken, personalEvent.delete);

// ✅ Delete all Personal Events by User Id (Only Admins)
router.delete('/user/:id', withAuth.verifyToken, withAuth.withHigherRoles, personalEvent.deleteAllByUserId);

// ✅ Delete all Personal Events (Only Admins)
router.delete('/', withAuth.verifyToken, withAuth.withHigherRoles, personalEvent.deleteAll);

module.exports = router;
