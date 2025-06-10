const db = require('../models');
const { createError } = require('../utils/errorHandler');
const { uploadFile } = require('../middleware/upload');  
const { Op } = require('sequelize');

// Test function to create a sample request
exports.createTestRequest = async (req, res, next) => {
    try {
        // Find a user to assign the request to
        const user = await db.user.findOne({
            where: { role: 'ROLE_FACULTY' }
        });

        if (!user) {
            throw createError(404, "No faculty user found to create test request");
        }

        // Create the onboarding request
        const request = await db.onboardingRequest.create({
            userId: user.id,
            college: 'Engineering',
            departmentId: 1,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            requestedBy: req.user.id,
            status: 'pending',
            currentStage: 'HR_VERIFIED'
        });

        // Create initial stage
        await db.onboardingStage.create({
            requestId: request.id,
            stageName: 'HR_VERIFIED',
            status: 'pending',
            assignedTo: req.user.id
        });

        res.status(201).json({
            message: "Test request created successfully",
            request
        });
    } catch (error) {
        next(error);
    }
};

// Request Management
exports.createRequest = async (req, res, next) => {
    try {
        const { userId, college, departmentId, dueDate } = req.body;
        
        const user = await db.user.findByPk(userId);
        if (!user) {
            throw createError(404, "User not found");
        }
        
        // Determine initial stage based on user role
        let initialStage = 'HR_VERIFIED';
        const userRole = req.userRole || req.user.role;
        
        // If the requesting user is not an HR admin, set initial stage to PENDING
        if (userRole !== 'ROLE_SUPER_ADMIN') {
            initialStage = 'PENDING';
        }
        
        const request = await db.onboardingRequest.create({
            userId,
            college,
            departmentId,
            dueDate,
            requestedBy: req.user.id,
            status: 'pending',
            currentStage: initialStage
        });
        
        await db.onboardingStage.create({
            requestId: request.id,
            stageName: initialStage,
            status: 'pending',
            assignedTo: req.user.id
        });
        
        res.status(201).json(request);
    } catch (error) {
        next(error);
    }
};

exports.getAllRequests = async (req, res, next) => {
    try {
        const { status, stage, page = 1, limit = 10, filter = 'all', sort = 'requestDate', order = 'desc' } = req.query;
        const query = {};

        // Apply filter
        if (filter === 'high') {
            // High priority filter - you can customize this based on your requirements
            query.status = 'pending';
            query.currentStage = 'HR_VERIFIED';
        } else if (status) {
            query.status = status;
        }
        
        if (stage) query.currentStage = stage;

        // Determine sort field and direction
        let sortField = 'requestDate';
        if (sort === 'employee.full_name') {
            sortField = '$employee.fullName$';
        } else if (sort === 'requestDate') {
            sortField = 'requestDate';
        }

        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const requests = await db.onboardingRequest.findAndCountAll({
            where: query,
            include: [
                { 
                    model: db.user, 
                    as: 'employee', 
                    attributes: ['id', 'fullName', 'role']
                },
                { model: db.user, as: 'requester', attributes: ['id', 'fullName'] },
                { model: db.onboardingStage, as: 'stages' },
                { model: db.onboardingDocument, as: 'requestDocuments' },
                { 
                    model: db.department,
                    as: 'department',
                    attributes: ['id', 'departmentName']
                }
            ],
            limit: parseInt(limit),
            offset: (page - 1) * limit,
            order: [[sortField, sortOrder]]
        });

        // Log the first request object to see its structure
        if (requests.rows.length > 0) {
            console.log('First request object:', JSON.stringify(requests.rows[0], null, 2));
        }

        res.json({
            requests: requests.rows,
            totalPages: Math.ceil(requests.count / limit),
            currentPage: parseInt(page),
            total: requests.count
        });
    } catch (error) {
        console.error('Error in getAllRequests:', error);
        next(error);
    }
};

exports.getRequestById = async (req, res, next) => {
    try {
        const request = await db.onboardingRequest.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: db.user,
                    as: 'employee',
                    attributes: ['id', 'fullName', 'role', 'departmentId'],
                    include: [{
                        model: db.department,
                        attributes: ['id', 'departmentName']
                    }]
                },
                {
                    model: db.user,
                    as: 'requester',
                    attributes: ['id', 'fullName']
                },
                {
                    model: db.onboardingStage,
                    as: 'stages',
                    include: [
                        {
                            model: db.user,
                            as: 'assignee',
                            attributes: ['id', 'fullName']
                        },
                        {
                            model: db.user,
                            as: 'completedByUser',
                            attributes: ['id', 'fullName']
                        }
                    ]
                },
                {
                    model: db.onboardingDocument,
                    as: 'requestDocuments',
                    include: [
                        {
                            model: db.user,
                            as: 'uploader',
                            attributes: ['id', 'fullName']
                        }
                    ]
                }
            ]
        });
        
        if (!request) {
            throw createError(404, "Request not found");
        }

        // Log the request object to see its structure
        console.log('Request object:', JSON.stringify(request, null, 2));
        
        res.json(request);
    } catch (error) {
        console.error('Error in getRequestById:', error);
        next(error);
    }
};

exports.updateRequest = async (req, res, next) => {
    try {
        const request = await db.onboardingRequest.findByPk(req.params.id);
        if (!request) {
            throw createError(404, "Request not found");
        }
        
        await request.update(req.body);
        res.json(request);
    } catch (error) {
        next(error);
    }
};

exports.deleteRequest = async (req, res, next) => {
    try {
        const request = await db.onboardingRequest.findByPk(req.params.id);
        if (!request) {
            throw createError(404, "Request not found");
        }
        
        await request.destroy();
        res.json({ message: "Request deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// Complete request
exports.completeRequest = async (req, res, next) => {
    try {
        const request = await db.onboardingRequest.findByPk(req.params.id);
        if (!request) {
            throw createError(404, "Request not found");
        }
        
        // Update request status
        await request.update({
            status: 'completed',
            completedBy: req.user.id,
            completionDate: new Date(),
            currentStage: 'COMPLETED'
        });
        
        // Create completed stage
        await db.onboardingStage.create({
            requestId: request.id,
            stageName: 'COMPLETED',
            status: 'completed',
            assignedTo: req.user.id,
            completedBy: req.user.id,
            completedDate: new Date()
        });
        
        res.json({ message: "Request completed successfully", request });
    } catch (error) {
        next(error);
    }
};

// Stage Management
exports.createStage = async (req, res, next) => {
    try {
        const { requestId, stageName, assignedTo } = req.body;
        
        const request = await db.onboardingRequest.findByPk(requestId);
        if (!request) {
            throw createError(404, "Request not found");
        }
        
        const stage = await db.onboardingStage.create({
            requestId,
            stageName,
            status: 'pending',
            assignedTo
        });
        
        res.status(201).json(stage);
    } catch (error) {
        next(error);
    }
};

exports.getStagesByRequest = async (req, res, next) => {
    try {
        const stages = await db.onboardingStage.findAll({
            where: { requestId: req.params.requestId },
            include: [
                { model: db.user, as: 'assignee', attributes: ['id', 'fullName'] }
            ]
        });
        
        res.json(stages);
    } catch (error) {
        next(error);
    }
};

exports.updateStage = async (req, res, next) => {
    try {
        const stage = await db.onboardingStage.findByPk(req.params.id);
        if (!stage) {
            throw createError(404, "Stage not found");
        }
        
        await stage.update(req.body);
        res.json(stage);
    } catch (error) {
        next(error);
    }
};

exports.deleteStage = async (req, res, next) => {
    try {
        const stage = await db.onboardingStage.findByPk(req.params.id);
        if (!stage) {
            throw createError(404, "Stage not found");
        }
        
        await stage.destroy();
        res.json({ message: "Stage deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// Document Management
exports.uploadDocument = async (req, res, next) => {
  try {
    console.log('Upload request received:', {
      params: req.params,
      body: req.body,
      file: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null
    });

    if (!req.file) {
      throw createError(400, "No file was uploaded");
    }

    const request = await db.onboardingRequest.findByPk(req.params.id);
    if (!request) {
      throw createError(404, "Onboarding request not found");
    }

    const document = await db.onboardingDocument.create({
      requestId: request.id,
      documentType: req.body.documentType,
      fileName: req.file.originalname,
      filePath: req.file.path, // Multer already saved the file
      uploadedBy: req.user.id,
      comments: req.body.description || '',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        documentType: document.documentType,
        fileName: document.fileName,
        status: document.status,
        uploadDate: document.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', {
      error: error.message,
      stack: error.stack
    });
    
    // Clean up file if upload failed
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to cleanup file:', err);
      });
    }
    
    next(error);
  }
};

exports.getDocuments = async (req, res, next) => {
  try {
    const documents = await db.onboardingDocument.findAll({
      where: { requestId: req.params.id },
      include: [{
        model: db.user,
        as: 'uploader',
        attributes: ['id', 'fullName']
      }]
    });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    next(error);
  }
};
exports.deleteDocument = async (req, res, next) => {
    try {
        const document = await OnboardingDocument.findByPk(req.params.documentId);
        if (!document) {
            throw createError(404, "Document not found");
        }

        await deleteFile(document.filePath);
        await document.destroy();
        
        res.json({ message: "Document deleted successfully" });
    } catch (error) {
        next(error);
    }
};

exports.downloadDocument = async (req, res, next) => {
    try {
        const document = await OnboardingDocument.findByPk(req.params.documentId);
        if (!document) {
            throw createError(404, "Document not found");
        }

        res.download(document.filePath, document.name);
    } catch (error) {
        next(error);
    }
};

exports.uploadBulkDocuments = async (req, res, next) => {
    try {
        const request = await OnboardingRequest.findByPk(req.params.requestId);
        if (!request) {
            throw createError(404, "Request not found");
        }

        if (!req.files || req.files.length === 0) {
            throw createError(400, "No files uploaded");
        }

        const documents = [];
        for (const file of req.files) {
            const filePath = await uploadFile(file, 'onboarding-documents');
            const document = await OnboardingDocument.create({
                requestId: request.id,
                documentType: req.body.documentType,
                fileName: file.originalname,
                filePath,
                uploadedBy: req.user.id,
                comments: req.body.description,
                status: 'pending'
            });
            documents.push(document);
        }

        res.status(201).json(documents);
    } catch (error) {
        console.error('Error in uploadBulkDocuments:', error);
        next(error);
    }
};

// Workflow Management
exports.transitionRequest = async (req, res, next) => {
    try {
        const request = await OnboardingRequest.findByPk(req.params.id);
        if (!request) {
            throw createError(404, "Request not found");
        }

        const nextStage = getNextStage(request.currentStage);
        if (!nextStage) {
            throw createError(400, "No next stage available");
        }

        const assignee = await getAssigneeForStage(nextStage);
        
        await request.update({ currentStage: nextStage });
        await OnboardingStage.create({
            requestId: request.id,
            stageName: nextStage,
            status: 'pending',
            assignedTo: assignee.id
        });

        res.json(request);
    } catch (error) {
        next(error);
    }
};

exports.rejectStage = async (req, res, next) => {
    try {
        const request = await OnboardingRequest.findByPk(req.params.id);
        if (!request) {
            throw createError(404, "Request not found");
        }

        await request.update({ 
            status: 'rejected',
            currentStage: 'REJECTED'
        });

        res.json(request);
    } catch (error) {
        next(error);
    }
};

// Helper Functions
function getNextStage(currentStage) {
    const stages = ['HR_VERIFIED', 'HOD_VERIFIED', 'PRINCIPAL_VERIFIED', 'COMPLETED'];
    const currentIndex = stages.indexOf(currentStage);
    return stages[currentIndex + 1] || null;
}

async function getAssigneeForStage(stage) {
    const roleMap = {
        'HR_VERIFIED': 'hr',
        'HOD_VERIFIED': 'hod',
        'PRINCIPAL_VERIFIED': 'principal'
    };
    
    const role = roleMap[stage];
    if (!role) {
        throw createError(400, "Invalid stage");
    }
    
    const assignee = await User.findOne({ where: { role } });
    if (!assignee) {
        throw createError(404, `No ${role} user found for assignment`);
    }
    
    return assignee;
}