const db = require("../models");
const DeptEvent = db.deptEvent;
const User = db.user;
const Department = db.department;

// Create Event
exports.create = async (req, res) => {
  try {
    const {
      eventName,
      eventDescription,
      startDate,
      endDate,
      createdByUserId,
      departmentId,
    } = req.body;

    if (
      !eventName ||
      !startDate ||
      !endDate ||
      !createdByUserId ||
      !departmentId
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newEvent = await DeptEvent.create({
      eventName,
      eventDescription,
      startDate,
      endDate,
      createdByUserId,
      departmentId,
      created_at: new Date(),
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create department event",
      error: error.message,
    });
  }
};

// Fetch All Events in College (for Admin)
exports.getCollegeEvents = async (req, res) => {
  try {
    const adminCollege = req.user.college;

    const events = await DeptEvent.findAll({
      attributes: [
        "id",
        "eventName",
        "eventDescription",
        "startDate",
        "endDate",
        "created_at",
      ],
      include: [
        {
          model: Department,
          attributes: [["department_name", "departmentName"]],
          where: { college: adminCollege },
          required: true,
        },
        {
          model: User,
          attributes: [["full_name", "fullName"]],
          required: true,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch department events",
      error: error.message,
    });
  }
};

// Fetch by Department ID
exports.findAllByDeptId = async (req, res) => {
  try {
    const deptId = req.params.id;

    const events = await DeptEvent.findAll({
      where: { departmentId: deptId },
      include: [
        { model: User, attributes: ["fullName"] },
        { model: Department, attributes: ["department_name"] },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch department events",
        error: error.message,
      });
  }
};

// Delete by ID
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DeptEvent.destroy({ where: { id } });

    if (deleted === 1) {
      res.json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete event", error: error.message });
  }
};
