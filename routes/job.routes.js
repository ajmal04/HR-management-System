var express = require('express');
var router = express.Router();

const withAuth = require("../withAuth");

const job = require("../controllers/job.controller.js");



//  Create a new Job (Only Admin & System Admin)
router.post('/', withAuth.verifyToken, withAuth.withHigherRoles, job.create);

//  Retrieve all Jobs (Admin, System Admin, HOD)
router.get('/', withAuth.verifyToken, withAuth.withHigherRoles, job.findAll);

//  Retrieve all Jobs by college
router.get('/college/list', withAuth.verifyToken, withAuth.withAdmin, job.getJobsByCollege);

//  Retrieve all Jobs by User ID (Admin, System Admin, HOD)
router.get('/user/:id', withAuth.verifyToken, withAuth.withHigherRoles, job.findAllByUserId);

//  Retrieve a single Job by ID (Accessible to all authenticated users)
router.get('/:id', withAuth.verifyToken, job.findOne);

//  Update a Job (Only Admin & System Admin)
router.put('/:id', withAuth.verifyToken, withAuth.withHigherRoles, job.update);

//  Delete a Job by ID (Only Super Admin & Admin)
router.delete('/:id', withAuth.verifyToken, withAuth.withHigherRoles, job.delete);

//  Delete all Jobs (Only Super Admin)
router.delete('/', withAuth.verifyToken, withAuth.withSuperAdmin, job.deleteAll);

//  Delete all Jobs by User ID (Only Super Admin & Admin)
router.delete('/user/:id', withAuth.verifyToken, withAuth.withHigherRoles, job.deleteAllByUserId);


module.exports = router;
