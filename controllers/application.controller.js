const db = require("../models");
const Application = db.application;
const User = db.user;
const Department = db.department
const Op = db.Sequelize.Op;
const moment = require('moment');
const { department } = require("../models");

// Create and Save a new Application
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
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

// Retrieve all Applications from the database.
exports.findAll = (req, res) => {
  Application.findAll({
    include: User
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Applications.",
      });
    });
};

// Retrieve all Applications from the database.
exports.findAllRecent = (req, res) => {
  Application.findAll({
    where: {
      [Op.and]: [
        {startDate: {
          [Op.gte]: moment().subtract(14, 'days').toDate()
        }},
        {startDate : {
          [Op.lte]: moment().add(7, 'days').toDate()
        }}
      ]
    },
    include: [{
      model: User
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Applications.",
      });
    });
};

// Retrieve all Applications from the database.
exports.findAllRecent = (req, res) => {
  Application.findAll({
    where: {
      [Op.and]: [
        {startDate: {
          [Op.gte]: moment().subtract(14, 'days').toDate()
        }},
        {startDate : {
          [Op.lte]: moment().add(7, 'days').toDate()
        }}
      ]
    },
    include: [{
      model: User
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Applications.",
      });
    });
};

exports.findAllRecentAndDept = (req, res) => {
  const id = req.params.id

  Application.findAll({
    where: {
      [Op.and]: [
        {startDate: {
          [Op.gte]: moment().subtract(14, 'days').toDate()
        }},
        {startDate : {
          [Op.lte]: moment().add(7, 'days').toDate()
        }}
      ]
    },
    include: [{
      model: User,
      where: {departmentId: id}
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Applications.",
      });
    });
};

exports.findAllRecentAndUser = (req, res) => {
  const id = req.params.id

  Application.findAll({
    where: {
      [Op.and]: [
        {startDate: {
          [Op.gte]: moment().subtract(14, 'days').toDate()
        }},
        {startDate : {
          [Op.lte]: moment().add(7, 'days').toDate()
        }}
      ]
    },
    include: [{
      model: User,
      where: {id: id}
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Applications.",
      });
    });
};

//Retrieve all Applications By User Id
exports.findAllByDeptId = (req, res) => {
  const deptId = req.params.id;

  Application.findAll({
    include: [{
      model: User,
      where: {departmentId: deptId}
    }]
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Applications.",
    });
  })
};

//Retrieve all Applications By User Id
exports.findAllByUserId = (req, res) => {
  const userId = req.params.id;

  User.findByPk(userId).then((user) => {
    Application.findAll({ 
      include: [{
        model: User
      }],
      where: { userId: userId } 
    })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Applications.",
        });
      });
  });
};

// Find a single Application with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Application.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Application with id=" + id,
      });
    });
};

// Update a Application by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Application.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Application was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Application with id=${id}. Maybe Application was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Application with id=" + id,
      });
    });
};

// Delete a Application with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Application.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Application was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Application with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Application with id=" + id,
      });
    });
};

// Delete all Applications from the database.
exports.deleteAll = (req, res) => {
  Application.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Applications were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Applications.",
      });
    });
};

// Delete all Applications by User Id.
exports.deleteAllByUserId = (req, res) => {
  const userId = req.params.id;

  Application.destroy({
    where: { userId: userId },
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Applications were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Applications.",
      });
    });
};


exports.getApplicationsByCollege = async (req, res) => {
  try {
    // 1. Get admin's college from the authenticated user
    const adminCollege = req.user.college;
    
    if (!adminCollege) {
      return res.status(400).json({ message: 'Admin college not specified' });
    }

    // 2. Find all applications from users in the same college
    const applications = await Application.findAll({
      include: [
        {
          model: User,
          where: { college: adminCollege },
          attributes: ['id', 'fullName'],
          include: [{
            model: Department,
            attributes: ['id', ['department_name', 'departmentName']]
        }],
          required: true
        }
      ],
      order: [['start_date', 'DESC']]
    });

    // 3. Format the response
    const formattedApplications = applications.map(app => ({
      ...app.get({ plain: true }),
      startDate: app.startDate ? moment(app.startDate).format('YYYY-MM-DD') : null,
      endDate: app.endDate ? moment(app.endDate).format('YYYY-MM-DD') : null
    }));

    res.status(200).json(formattedApplications);
    
  } catch (err) {
    console.error('Error fetching college applications:', err);
    res.status(500).json({ 
      message: 'Failed to fetch applications',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
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