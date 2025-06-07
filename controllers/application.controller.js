const db = require("../models");
const Application = db.application;
const User = db.user;
const Department = db.department;
const Op = db.Sequelize.Op;
const moment = require("moment");

// Create and Save a new Application
exports.create = (req, res) => {
  if (!req.body) {

    return res.status(400).send({ message: "Content can not be empty!" });
  }

  const application = {
    reason: req.body.reason,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    status: "pending",
    type: req.body.type,
    userId: req.body.userId,
    hodStatus: "Pending",
    hodComment: null,
    adminStatus: "Pending",
    adminComment: null,
  };

  Application.create(application)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Application.",
      })
    );
      return res.status(400).send({
          message: "Content cannot be empty!"
      });
  }

  // Validate application type
  const validTypes = [
      'annual_leave',
      'sick_leave',
      'medical_leave',
      'maternity_paternity',
      'bereavement_leave',
      'business_trip',
      'remote_work',
      'training',
      'personal_development',
      'volunteer',
      'other'
  ];

  if (!validTypes.includes(req.body.type)) {
      return res.status(400).send({
          message: "Invalid application type"
      });
  }

  // Date validation
  if (new Date(req.body.startDate) > new Date(req.body.endDate)) {
      return res.status(400).send({
          message: "End date must be after start date"
      });
  }

  // Create application object
  const application = {
      reason: req.body.reason,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: "Pending", // Ensure case matches ENUM
      type: req.body.type,
      userId: req.body.userId
  };

  // Save to database
  Application.create(application)
      .then(data => {
          res.status(201).send(data);
      })
      .catch(err => {
          console.error("Application creation error:", err);
          res.status(500).send({
              message: err.message || "Error creating application"
          });
      });

};

// Retrieve all Applications
exports.findAll = (req, res) => {
  Application.findAll({ include: User })
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Applications.",
      })
    );
};

// Retrieve applications from past 14 days to next 7 days
exports.findAllRecent = (req, res) => {
  Application.findAll({
    where: {
      startDate: {
        [Op.gte]: moment().subtract(14, "days").toDate(),
        [Op.lte]: moment().add(7, "days").toDate(),
      },
    },
    include: [User],
  })
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving recent Applications.",
      })
    );
};

// Retrieve recent Applications by Department
exports.findAllRecentAndDept = (req, res) => {
  const id = req.params.id;

  Application.findAll({
    where: {
      startDate: {
        [Op.gte]: moment().subtract(14, "days").toDate(),
        [Op.lte]: moment().add(7, "days").toDate(),
      },
    },
    include: [
      {
        model: User,
        where: { departmentId: id },
        jobPosition: { [Op.ne]: "HOD" },
      },
    ],
  })
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving department applications.",
      })
    );
};

// Retrieve recent Applications by User
exports.findAllRecentAndUser = (req, res) => {
  const id = req.params.id;

  Application.findAll({
    where: {
      startDate: {
        [Op.gte]: moment().subtract(14, "days").toDate(),
        [Op.lte]: moment().add(7, "days").toDate(),
      },
    },
    include: [
      {
        model: User,
        where: { id: id },
      },
    ],
  })
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving user applications.",
      })
    );
};

// Retrieve all Applications by Department ID
exports.findAllByDeptId = (req, res) => {
  const deptId = req.params.id;

  Application.findAll({
    include: [
      {
        model: User,
        where: { departmentId: deptId },
      },
    ],
  })
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving applications by department.",
      })
    );
};

// Retrieve all Applications by User ID
exports.findAllByUserId = (req, res) => {
  const userId = req.params.id;

  User.findByPk(userId).then(() => {
    Application.findAll({
      where: { userId: userId },
      include: [User],
    })
      .then((applications) => {
        const updatedApplications = applications.map((app) => {
          const appData = app.toJSON();

          if (appData.hodStatus === "Approved" && !appData.hodComment) {
            appData.hodComment = "-";
          }

          if (appData.adminStatus === "Approved" && !appData.adminComment) {
            appData.adminComment = "-";
          }

          if (appData.hodStatus === "Rejected") {
            appData.adminStatus = "NA";
            appData.adminComment = "NA";
          }

          return appData;
        });

        res.send(updatedApplications);
      })
      .catch((err) =>
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving user applications.",
        })
      );
  });
};

// Retrieve a single Application by ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Application.findByPk(id)
    .then((data) => res.send(data))
    .catch(() =>
      res.status(500).send({
        message: `Error retrieving Application with id=${id}`,
      })
    );
};

// Update an Application by ID
exports.update = (req, res) => {
  const id = req.params.id;

  Application.update(req.body, { where: { id } })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Application was updated successfully." });
      } else {
        res.send({
          message: `Cannot update Application with id=${id}. Maybe Application was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) =>
      res.status(500).send({
        message: `Error updating Application with id=${id}`,
      })
    );
};

// Update HOD status and comment
exports.hodUpdate = async (req, res) => {
  const id = req.params.id;
  const { status, comment } = req.body;

  try {
    const updateData = {
      hodStatus: status,
      hodComment: status == "Approved" ? "NA" : comment,
    };

    if (status === "Rejected") {
      updateData.status = "Rejected";
      updateData.adminStatus = "Not Applicable";
    }

    await Application.update(updateData, { where: { id } });
    res.send({ message: "HOD decision recorded." });
  } catch (err) {
    res.status(500).send({ message: "Error updating HOD status." });
  }
};

// Update Admin status and comment
exports.adminUpdate = async (req, res) => {
  const id = req.params.id;
  const { status, comment } = req.body;

  try {
    const updateData = {
      adminStatus: status,
      adminComment: comment,
    };

    if (status === "Approved") {
      updateData.status = "Approved";
    } else if (status === "Rejected") {
      updateData.status = "Rejected";
    }

    await Application.update(updateData, { where: { id } });
    res.send({ message: "Admin decision recorded." });
  } catch (err) {
    res.status(500).send({ message: "Error updating Admin status." });
  }
};

// Delete an Application by ID
exports.delete = (req, res) => {
  const id = req.params.id;

  Application.destroy({ where: { id } })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Application was deleted successfully!" });
      } else {
        res.send({
          message: `Cannot delete Application with id=${id}. Maybe Application was not found!`,
        });
      }
    })
    .catch((err) =>
      res.status(500).send({
        message: `Could not delete Application with id=${id}`,
      })
    );
};

// Delete all Applications
exports.deleteAll = (req, res) => {
  Application.destroy({ where: {}, truncate: false })
    .then((nums) =>
      res.send({ message: `${nums} Applications were deleted successfully!` })
    )
    .catch((err) =>
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Applications.",
      })
    );
};

// Delete all Applications by User ID
exports.deleteAllByUserId = (req, res) => {
  const userId = req.params.id;

  Application.destroy({ where: { userId }, truncate: false })
    .then((nums) =>
      res.send({ message: `${nums} Applications were deleted successfully!` })
    )
    .catch((err) =>
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Applications.",
      })
    );
};

// Retrieve all applications by college (for admins)
exports.getApplicationsByCollege = async (req, res) => {
  try {
    const adminCollege = req.user.college;

    if (!adminCollege) {
      return res.status(400).json({ message: "Admin college not specified" });
    }

    const applications = await Application.findAll({
      include: [
        {
          model: User,
          where: { college: adminCollege },
          attributes: ["id", "fullName", "college", "jobPosition"],
          include: [
            {
              model: Department,
              attributes: ["id", ["department_name", "departmentName"]],
            },
          ],
        },
      ],
    });

    // ✅ Convert "Pending" to "NA" if user is a HOD
    const updatedApplications = applications.map((app) => {
      const appData = app.toJSON();
      const isHod = appData.user?.jobPosition === "HOD";

      if (isHod && appData.hodStatus === "Pending") {
        appData.hodStatus = "NA";
        appData.hodComment = "NA";
      }
      if (!isHod && appData.hodStatus === "Approved" && !appData.hodComment) {
        appData.hodComment = "-";
      }
      if (appData.adminStatus === "Approved" && !appData.adminComment) {
        appData.adminComment = "-";
      }
      //HOD Reject the application, then the admin's status and comment should be filled with NA
      if (appData.hodStatus === "Rejected") {
        appData.adminStatus = "NA";
        appData.adminComment = "NA";
      }
      return appData;
    });

    res.send(updatedApplications);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error retrieving applications by college.",
    });
  }
};

exports.findAllRecentByCollege = (req, res) => {
  const userCollege = req.user.college; // Get admin's college from JWT token
  
  Application.findAll({
    where: {
      [Op.and]: [
        { 
          startDate: {
            [Op.gte]: moment().subtract(14, 'days').toDate()
          }
        },
        {
          startDate: {
            [Op.lte]: moment().add(7, 'days').toDate()
          }
        }
      ]
    },
    include: [{
      model: User,
      where: { college: userCollege },
      attributes: ['id', 'fullName'] 
    }]
  })
  .then(applications => {
    
    const formattedData = applications.map(app => ({
      ...app.get({ plain: true }),
      applicantName: app.User ? app.User.fullName : null
    }));
    
    res.send(formattedData);
  })
  .catch(err => {
    console.error('Error fetching college applications:', err);
    res.status(500).send({
      message: "Error retrieving college applications",
      error: err.message
    });
  });
};
