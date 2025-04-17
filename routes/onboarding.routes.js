var express = require('express');
var router = express.Router();

const withAuth = require("../withAuth");
const onboarding = require('../controllers/onboarding.controller.js');

// Create new onboarding request
router.post('/', withAuth.verifyToken, withAuth.withSuperAdmin, onboarding.createRequest);

router.get('/', withAuth.verifyToken, withAuth.withSuperAdmin,)

// Get pending requests
router.get('/pending', withAuth.verifyToken, withAuth.withSystemAdmin, onboarding.getPendingRequests);

// Complete onboarding
router.patch('/:id/complete', withAuth.verifyToken, withAuth.withSystemAdmin, onboarding.completeOnboarding);

router.patch ('/bulk-complete',withAuth.verifyToken, withAuth.withSystemAdmin, onboarding.bulkCompleteOnboarding);

module.exports = router;