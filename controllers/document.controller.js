const { employeeDocument: EmployeeDocument, user: User } = require('../models');
const { uploadFile, deleteFile } = require('../utils/fileUpload');
const createError = require('http-errors');

// Upload documents
exports.uploadDocuments = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      throw createError(400, 'User ID is required');
    }

    const documents = [];
    const files = req.files;

    const addDoc = async (file, docType, comments) => {
      if (file && file.buffer) {
        const filePath = await uploadFile(file, 'documents');
        documents.push({
          userId,
          documentType: docType,
          fileName: file.originalname,
          filePath,
          uploadedBy: req.user.id,
          status: 'pending',
          comments
        });
      }
    };

    // Government ID documents
    await addDoc(files.aadharCard?.[0], 'ID_PROOF', 'Aadhar Card');
    await addDoc(files.panCard?.[0], 'ID_PROOF', 'PAN Card');
    await addDoc(files.passport?.[0], 'ID_PROOF', 'Passport');
    await addDoc(files.drivingLicense?.[0], 'ID_PROOF', 'Driving License');

    // Educational Certificates
    if (files.educationalCertificates) {
      for (const file of files.educationalCertificates) {
        await addDoc(file, 'EDUCATIONAL_CERTIFICATES', 'Educational Certificate');
      }
    }

    // Experience Certificates
    if (files.experienceCertificates) {
      for (const file of files.experienceCertificates) {
        await addDoc(file, 'EXPERIENCE_LETTERS', 'Experience Certificate');
      }
    }

    // Save all documents
    const savedDocuments = await EmployeeDocument.bulkCreate(documents);

    res.status(201).json({
      message: 'Documents uploaded successfully',
      documents: savedDocuments
    });
  } catch (error) {
    next(error);
  }
};

// Get documents by user ID
exports.getDocumentsByUserId = async (req, res, next) => {
  try {
    const documents = await EmployeeDocument.findAll({
      where: { userId: req.params.userId },
      include: [{
        model: User,
        as: 'uploader',
        attributes: ['id', 'fullName']
      }]
    });
    res.json(documents);
  } catch (error) {
    next(error);
  }
};

// Delete document
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await EmployeeDocument.findByPk(req.params.id);
    if (!document) {
      throw createError(404, 'Document not found');
    }

    await deleteFile(document.filePath);
    await document.destroy();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};
