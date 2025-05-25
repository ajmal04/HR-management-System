module.exports = (sequelize, Sequelize) => {
<<<<<<< HEAD
  const Application = sequelize.define(
    "application",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["Approved", "Rejected", "Pending"],
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM,
        values: ["Normal", "Student", "Illness", "Marriage"],
        allowNull: false,
      },
      hodStatus: {
        type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
      },
      hodComment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      adminStatus: {
        type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
      },
      adminComment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
      freezeTableName: true,
    }
  );
=======
    const Application = sequelize.define("application", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        type: {
            type: Sequelize.ENUM,
            values: [
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
            ],
            allowNull: false
        },
        reason: {
            type: Sequelize.STRING,
            allowNull: true
        },
        startDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        endDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM,
            values: ['Approved', 'Rejected', 'Pending'],
            defaultValue: 'Pending',
            allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true, // Recommended to keep track of creation/update
        underscored: true,
        freezeTableName: true,
    });
>>>>>>> e0349e3f2d10d722e3d8954792197004c6aee799

  return Application;
};
