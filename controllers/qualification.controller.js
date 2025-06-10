const db = require("../models");
const Qualification = db.qualification
const User = db.user
const Op = db.Sequelize.Op;
const moment = require('moment')

// Get all qualifications
exports.getAllQualifications = async (req, res) => {
  try {
    const qualifications = await Qualification.findAll({
      include: [{
        model: User,
        attributes: ['id', 'username', 'email']
      }]
    });
    res.json(qualifications);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching qualifications",
      error: error.message 
    });
  }
};

// Get qualification by ID
exports.getQualificationById = async (req, res) => {
  try {
    const qualification = await Qualification.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'email']
      }]
    });
    if (!qualification) {
      return res.status(404).json({ 
        message: "Qualification not found" 
      });
    }
    res.json(qualification);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching qualification",
      error: error.message 
    });
  }
};

// Create new qualification
exports.createQualification = async (req, res) => {
  try {
    const {
      highestQualification,
      university,
      graduationYear,
      fieldOfStudy,
      gpa,
      certifications,
      userId
    } = req.body;

    // Validate graduation year
    const currentYear = new Date().getFullYear();
    if (graduationYear && (graduationYear < 1950 || graduationYear > currentYear)) {
      return res.status(400).json({
        message: `Graduation year must be between 1950 and ${currentYear}`
      });
    }

    // Validate GPA
    if (gpa && (gpa < 0 || gpa > 4)) {
      return res.status(400).json({
        message: "GPA must be between 0 and 4"
      });
    }

    const qualification = await Qualification.create({
      highestQualification,
      university,
      graduationYear,
      fieldOfStudy,
      gpa,
      certifications,
      userId
    });

    res.status(201).json({
      message: "Qualification created successfully",
      qualification
    });
  } catch (error) {
    res.status(400).json({ 
      message: "Error creating qualification",
      error: error.message 
    });
  }
};

// Update qualification
exports.updateQualification = async (req, res) => {
  try {
    const qualification = await Qualification.findByPk(req.params.id);
    if (!qualification) {
      return res.status(404).json({ 
        message: "Qualification not found" 
      });
    }

    const {
      highestQualification,
      university,
      graduationYear,
      fieldOfStudy,
      gpa,
      certifications
    } = req.body;

    // Validate graduation year
    const currentYear = new Date().getFullYear();
    if (graduationYear && (graduationYear < 1950 || graduationYear > currentYear)) {
      return res.status(400).json({
        message: `Graduation year must be between 1950 and ${currentYear}`
      });
    }

    // Validate GPA
    if (gpa && (gpa < 0 || gpa > 4)) {
      return res.status(400).json({
        message: "GPA must be between 0 and 4"
      });
    }

    await qualification.update({
      highestQualification,
      university,
      graduationYear,
      fieldOfStudy,
      gpa,
      certifications
    });

    res.json({
      message: "Qualification updated successfully",
      qualification
    });
  } catch (error) {
    res.status(400).json({ 
      message: "Error updating qualification",
      error: error.message 
    });
  }
};

// Delete qualification
exports.deleteQualification = async (req, res) => {
  try {
    const qualification = await Qualification.findByPk(req.params.id);
    if (!qualification) {
      return res.status(404).json({ 
        message: "Qualification not found" 
      });
    }

    await qualification.destroy();
    res.json({ 
      message: "Qualification deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting qualification",
      error: error.message 
    });
  }
};

// Get qualifications by user ID
exports.getQualificationsByUserId = async (req, res) => {
  try {
    const qualifications = await Qualification.findAll({
      where: { userId: req.params.userId },
      include: [{
        model: User,
        attributes: ['id', 'username', 'email']
      }]
    });
    res.json(qualifications);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching user qualifications",
      error: error.message 
    });
  }
}; 