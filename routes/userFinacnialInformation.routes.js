var express = require('express');
var router = express.Router();

const withAuth = require("../withAuth");
const financialInformation = require("../controllers/userFinancialInformation.controller");

// ✅ Create a new User Financial Information (Only Admins)
router.post('/', withAuth.verifyToken, withAuth.withHigherRoles, financialInformation.create);

// ✅ Retrieve all User Financial Information (Only Admins & System Admins)
router.get('/', withAuth.verifyToken, withAuth.withHigherRoles, financialInformation.findAll);

// ✅ Retrieve User Financial Information by User Id (Admins & System Admins OR User themselves)
router.get('/user/:id', withAuth.verifyToken, withAuth.withHigherRoles, financialInformation.findByUserId);
router.get('/self', withAuth.verifyToken, financialInformation.findSelf); // Allow users to see their own info

// ✅ Retrieve a single User Financial Information (Only Admins & System Admins)
router.get('/:id', withAuth.verifyToken, withAuth.withHigherRoles, financialInformation.findOne);

// ✅ Update a User Financial Information (Only Admins)
router.put('/:id', withAuth.verifyToken, withAuth.withHigherRoles, financialInformation.update);

module.exports = router;
