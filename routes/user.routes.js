var express = require('express');
var router = express.Router();

const withAuth = require("../withAuth");
const user = require("../controllers/user.controller.js");

//  Create a new user (Only Super Admin can create users)
router.post('/', withAuth.verifyToken, withAuth.withSuperAdmin, user.create);

//  Retrieve all Users (Super Admin, System Admin, Admins)
router.get('/', withAuth.verifyToken, withAuth.withHigherRoles, user.findAll);

//  Retrieve total user count (Admins, System Admin)
router.get('/total', withAuth.verifyToken, withAuth.withHigherRoles, user.findTotal);

router.get('/total/college', withAuth.verifyToken, withAuth.withAdmin, user.findTotalByCollege);

//  Retrieve user count by department (Admins, HODs)
router.get('/total/department/:id', withAuth.verifyToken, withAuth.withAdminOrHOD, user.findTotalByDept);

//  Retrieve all users by department ID (Admins, HODs)
router.get('/department/:id', withAuth.verifyToken, withAuth.withAdminOrHOD, user.findAllByDeptId);

//  Retrieve a single user (Admins, HODs, System Admins)
router.get('/:id', withAuth.verifyToken, user.findOne);

//  Update a user (Admins can update any user, Users can update their own profile)
router.put('/:id', withAuth.verifyToken, withAuth.withHigherRoles, user.update);
router.put('/profile/:id', withAuth.verifyToken, user.update);  // Allow users to update their profile

//  Change Password (Authenticated users can change their password)
router.put('/changePassword/:id', withAuth.verifyToken, user.changePassword);

//  Delete a user (Admins can delete any user, Users can delete their own account)
router.delete('/:id', withAuth.verifyToken, withAuth.withHigherRoles, user.delete);

//  Delete all users (Only Super Admin can delete all users)
router.delete('/', withAuth.verifyToken, withAuth.withSuperAdmin, user.deleteAll);

//  Delete all users by department ID (Only Admins can delete users from their department)
router.delete('/department/:id', withAuth.verifyToken, withAuth.withHigherRoles, user.deleteAllByDeptId);

module.exports = router;
