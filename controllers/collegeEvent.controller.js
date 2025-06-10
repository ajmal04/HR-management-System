const db = require("../models");
const CollegeEvent = db.collegeEvent;
const User = db.user;

exports.create = async (req, res) => {
  try {
    const {
      eventName,
      eventDescription,
      startDate,
      endDate,
      createdByUserId,
      college,
    } = req.body;

    if (!eventName || !startDate || !endDate || !createdByUserId || !college) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newEvent = await CollegeEvent.create({
      eventName,
      eventDescription,
      startDate,
      endDate,
      createdByUserId,
      college,
      created_at: new Date(),
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create college event",
      error: error.message,
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const isSuperAdmin = req.user.role === "superadmin"; // adjust if your role field is named differently
    const userCollege = req.user.college;

    const whereClause = isSuperAdmin
      ? {} // show all events to SuperAdmin
      : { college: userCollege }; // restrict others by college

    const events = await CollegeEvent.findAll({
      where: whereClause,
      include: [{ model: User, attributes: ["fullName"] }],
      order: [["created_at", "DESC"]],
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve college events",
      error: error.message,
    });
  }
};

exports.findRecent = async (req, res) => {
  try {
    const events = await CollegeEvent.findAll({
      include: [{ model: User, attributes: ["fullName"] }],
      order: [["created_at", "DESC"]],
      limit: 2,
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recent college events",
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CollegeEvent.destroy({ where: { id } });

    if (deleted === 1) {
      res.json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete", error: error.message });
  }
};
