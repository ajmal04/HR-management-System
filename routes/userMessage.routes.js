var express = require('express');
var router = express.Router();

const withAuth = require("../withAuth");
const message = require("../controllers/userMessage.controller.js"); 

// ✅ Create a new Message (Authenticated Users)
router.post('/', withAuth.verifyToken, message.create);

// ✅ Retrieve all Messages by User Id (Only Admins OR the User themselves)
router.get('/user/:id', withAuth.verifyToken, withAuth.withAdminOrSelf, message.findAllByUserId);

// ✅ Retrieve a single Message by Id (Only Admins OR the Message Owner)
router.get('/:id', withAuth.verifyToken, withAuth.withAdminOrSelf, message.findOne);

// ✅ Delete all Messages (Only Admins)
router.delete('/', withAuth.verifyToken, withAuth.withAdmin, message.deleteAll);

// ✅ Delete a Message by Id (Admins OR the Message Owner)
router.delete('/:id', withAuth.verifyToken, withAuth.withAdminOrSelf, message.delete);

// ✅ Delete all Messages by User Id (Only Admins)
router.delete('/user/:id', withAuth.verifyToken, withAuth.withAdmin, message.deleteAllByUserId);

module.exports = router;
