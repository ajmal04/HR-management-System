const express = require('express');
const router = express.Router();
const qualificationController = require('../controllers/qualification.controller');
const withAuth = require("../withAuth");

// Get all qualifications
router.get('/', withAuth.verifyToken, qualificationController.getAllQualifications);

// Get qualification by ID
router.get('/:id', withAuth.verifyToken, qualificationController.getQualificationById);

// Get qualifications by user ID
router.get('/user/:userId', withAuth.verifyToken, qualificationController.getQualificationsByUserId);

// Create new qualification
router.post('/', withAuth.verifyToken, qualificationController.createQualification);

// Update qualification
router.put('/:id', withAuth.verifyToken, qualificationController.updateQualification);

// Delete qualification
router.delete('/:id', withAuth.verifyToken, qualificationController.deleteQualification);

module.exports = router; 