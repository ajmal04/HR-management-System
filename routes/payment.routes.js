var express = require('express');
var router = express.Router();

const withAuth = require("../withAuth");
const payment = require("../controllers/payment.controller.js");

// ✅ Create a new Payment (Super Admin, Admin)
router.post('/', withAuth.verifyToken, withAuth.withHigherRoles, payment.create);

// ✅ Retrieve all Payments (Admin, System Admin, Manager)
router.get('/', withAuth.verifyToken, withAuth.withHigherRoles, payment.findAll);

// ✅ Retrieve Payments By Year (Admin, Manager)
router.get('/year/:id', withAuth.verifyToken, withAuth.withHigherRoles, payment.findAllByYear);

// ✅ Retrieve all Payments by Job Id (Admin, Manager)
router.get('/job/:id', withAuth.verifyToken, withAuth.withHigherRoles, payment.findAllByJobId);

// ✅ Retrieve all Payments by User Id (User, Admin, System Admin)
router.get('/user/:id', withAuth.verifyToken, withAuth.withHigherRoles, payment.findAllByUser);

// ✅ Retrieve a single Payment by ID (Admin, Manager)
router.get('/:id', withAuth.verifyToken, withAuth.withHigherRoles, payment.findOne);

// ✅ Update a Payment by ID (Admin, Manager)
router.put('/:id', withAuth.verifyToken, withAuth.withHigherRoles, payment.update);

// ✅ Delete a Payment by ID (Super Admin, Admin)
router.delete('/:id', withAuth.verifyToken, withAuth.withHigherRoles, payment.delete);

// ✅ Delete all Payments (Super Admin Only)
router.delete('/', withAuth.verifyToken, withAuth.withSuperAdmin, payment.deleteAll);

// ✅ Delete all Payments by Job ID (Super Admin, Admin)
router.delete('/job/:id', withAuth.verifyToken, withAuth.withHigherRoles, payment.deleteAllByOrgId);

module.exports = router;
