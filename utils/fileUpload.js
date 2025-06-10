const multer = require('multer');
const path = require('path');
const fs = require('fs');
const createError = require('http-errors');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter for images and PDFs only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed!'), false);
  }
};

// Upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// File upload utility
const uploadFile = async (file, subDir = '') => {
  try {
    if (!file || !file.buffer) {
      throw createError(400, 'Invalid file or empty buffer');
    }

    const uploadDir = path.join(__dirname, '../uploads', subDir);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    const filepath = path.join(uploadDir, filename);

    await fs.promises.writeFile(filepath, file.buffer);
    return path.join(subDir, filename);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// File delete utility
const deleteFile = async (filePath) => {
  try {
    if (!filePath) return false;

    const fullPath = path.join(__dirname, '../uploads', filePath);
    if (!fs.existsSync(fullPath)) return false;

    await fs.promises.unlink(fullPath);
    return true;
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
    return false;
  }
};

module.exports = {
  upload,
  uploadFile,
  deleteFile
};
