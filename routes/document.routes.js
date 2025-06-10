const express = require('express');
const router = express.Router();
const employeeDocumentController = require('../controllers/document.controller');
const withAuth = require('../withAuth');
const { upload } = require('../utils/fileUpload');

// Upload documents
router.post('/',
  withAuth.verifyToken,
  upload.fields([
    { name: 'aadharCard', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'passport', maxCount: 1 },
    { name: 'drivingLicense', maxCount: 1 },
    { name: 'educationalCertificates', maxCount: 5 },
    { name: 'experienceCertificates', maxCount: 5 }
  ]),
  employeeDocumentController.uploadDocuments
);

// Get documents by user ID
router.get('/user/:userId', withAuth.verifyToken, employeeDocumentController.getDocumentsByUserId);

// Delete document
router.delete('/:id', withAuth.verifyToken, employeeDocumentController.deleteDocument);

module.exports = router;
