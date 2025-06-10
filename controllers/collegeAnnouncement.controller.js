const db = require("../models");
const CollegeAnnouncement = db.collegeAnnouncement;
const User = db.user;

exports.create = async (req, res) => {
  try {
    const {
      announcementTitle,
      announcementDescription,
      createdByUserId,
      college,
    } = req.body;

    if (!announcementTitle || !createdByUserId || !college) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newAnnouncement = await CollegeAnnouncement.create({
      announcementTitle,
      announcementDescription,
      createdByUserId,
      college,
      created_at: new Date(),
    });

    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create college announcement",
      error: error.message,
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const userCollege = req.user.college;

    if (!userCollege) {
      return res
        .status(400)
        .json({ message: "College not found in user profile" });
    }

    const announcements = await CollegeAnnouncement.findAll({
      where: { college: userCollege },
      include: [
        {
          model: User,
          attributes: ["fullName"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve college announcements",
      error: error.message,
    });
  }
};

exports.findRecent = async (req, res) => {
  try {
    const announcements = await CollegeAnnouncement.findAll({
      include: [
        {
          model: User,
          attributes: ["fullName"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 2,
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recent college announcements",
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CollegeAnnouncement.destroy({ where: { id } });

    if (deleted === 1) {
      res.json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "Announcement not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete", error: error.message });
  }
};
