const db = require('../models');
const User = db.user;

// Middleware to check if user has permission for a specific stage
exports.checkStagePermission = async (req, res, next) => {
  try {
    const stage = req.params.stage || req.body.stageName;
    
    // If no stage is specified (e.g., creating a new request), allow higher roles
    if (!stage) {
      const allowedRoles = ['ROLE_SUPER_ADMIN', 'ROLE_SYSTEM_ADMIN', 'ROLE_ADMIN', 'ROLE_HOD'];
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "You don't have permission to perform this action. Required role: Admin or higher"
        });
      }
      return next();
    }
    
    // For initial stage (PENDING), allow all higher roles
    if (stage === 'PENDING') {
      const allowedRoles = ['ROLE_SUPER_ADMIN', 'ROLE_SYSTEM_ADMIN', 'ROLE_ADMIN', 'ROLE_HOD'];
      if (allowedRoles.includes(req.user.role)) {
        return next();
      }
    }
    
    // Check permissions for specific stages
    const stagePermissions = {
      'HR_VERIFIED': ['ROLE_SUPER_ADMIN', 'ROLE_SYSTEM_ADMIN'],
      'DOCUMENT_VERIFICATION': ['ROLE_SUPER_ADMIN', 'ROLE_SYSTEM_ADMIN'],
      'FINAL_APPROVAL': ['ROLE_SUPER_ADMIN', 'ROLE_SYSTEM_ADMIN']
    };
    
    if (!stagePermissions[stage]) {
      return res.status(400).json({ message: "Invalid stage" });
    }
    
    if (!stagePermissions[stage].includes(req.user.role)) {
      return res.status(403).json({
        message: `You don't have permission for stage: ${stage}`
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user can view onboarding requests
exports.canViewRequests = async (req, res, next) => {
  try {
    // Check if user has permission to view requests
    const allowedRoles = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_HOD', 'ROLE_HR'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "You don't have permission to view onboarding requests",
        requiredRole: allowedRoles[0]
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user can manage documents
exports.canManageDocuments = async (req, res, next) => {
  try {
    // Check if user has permission to manage documents
    const allowedRoles = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_HR'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "You don't have permission to manage documents",
        requiredRole: allowedRoles[0]
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
}; 