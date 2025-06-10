const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboarding.controller');
const { verifyToken, withHigherRoles, withAdmin } = require('../withAuth');
const { checkStagePermission, canManageDocuments } = require('../middleware/onboardingAuth');
const upload = require('../middleware/upload'); 

// Apply authentication middleware to all routes
router.use(verifyToken);

// Test route to create a sample request
router.post('/test/create', withAdmin, onboardingController.createTestRequest);

// Legacy routes for backward compatibility
router.get('/requests', 
  withHigherRoles, 
  onboardingController.getAllRequests
);

router.get('/requests/:id', 
  withHigherRoles, 
  onboardingController.getRequestById
);

router.post('/requests', 
  withHigherRoles, 
  
  onboardingController.createRequest
);

router.put('/requests/:id', 
  withHigherRoles, 
  checkStagePermission, 
  onboardingController.updateRequest
);

// Add complete endpoint
router.patch('/requests/:id/complete', 
  withHigherRoles, 
  checkStagePermission, 
  onboardingController.completeRequest
);

// Add transition endpoint
router.post('/requests/:id/transition', 
  withHigherRoles, 
  checkStagePermission, 
  onboardingController.transitionRequest
);

router.delete('/requests/:id', 
  withAdmin, 
  checkStagePermission, 
  onboardingController.deleteRequest
);

// Document management routes (legacy)
router.post('/requests/:id/documents', 
  verifyToken, 
  withHigherRoles,
  upload.single('file'), 
  onboardingController.uploadDocument
);

router.get('/requests/:id/documents', 
  withHigherRoles, 
  canManageDocuments, 
  onboardingController.getDocuments
);

router.delete('/requests/:id/documents/:documentId', 
  withHigherRoles, 
  canManageDocuments, 
  onboardingController.deleteDocument
);

// Stage management routes
router.post('/requests/:id/stages', 
  withHigherRoles, 
  checkStagePermission, 
  onboardingController.createStage
);

router.get('/requests/:id/stages', 
  withHigherRoles, 
  onboardingController.getStagesByRequest
);

router.put('/requests/:id/stages/:stageId', 
  withHigherRoles, 
  checkStagePermission, 
  onboardingController.updateStage
);

router.delete('/requests/:id/stages/:stageId', 
  withAdmin, 
  checkStagePermission, 
  onboardingController.deleteStage
);

// Update document upload routes to use the centralized upload middleware
router.post('/requests/:requestId/documents', verifyToken, withHigherRoles, upload.single('document'), onboardingController.uploadDocument);
router.post('/requests/:requestId/documents/bulk', verifyToken, withHigherRoles, upload.array('documents', 5), onboardingController.uploadBulkDocuments);

module.exports = router;