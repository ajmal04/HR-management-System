const fs = require('fs');
const path = require('path');
const createError = require('http-errors');

/**
 * Upload a file to the specified directory
 * @param {Object} file - The file object from multer
 * @param {String} subDir - The subdirectory to store the file in
 * @returns {String} - The path to the uploaded file
 */
exports.uploadFile = async (file, subDir = '') => {
  try {
    if (!file) {
      throw createError(400, 'No file provided');
    }

    // The file has already been moved by multer, just return the relative path
    return path.join(subDir, path.basename(file.path));
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw createError(500, `Error uploading file: ${error.message}`);
  }
};

/**
 * Delete a file from the filesystem
 * @param {String} filePath - The path to the file to delete
 * @returns {Boolean} - True if the file was deleted successfully
 */
exports.deleteFile = async (filePath) => {
  try {
    if (!filePath) {
      return false;
    }

    const fullPath = path.join('uploads', filePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return false;
    }

    // Delete the file
    await fs.promises.unlink(fullPath);
    return true;
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
    return false;
  }
}; 