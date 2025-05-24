const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Resignation = sequelize.define(
    "Resignation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      college: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      personalEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      collegeEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      dateOfJoining: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      reasonForResignation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dateOfSubmission: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      noticePeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hodStatus: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      principalStatus: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      hrStatus: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      hodComment: {
        type: DataTypes.TEXT,
      },
      principalComment: {
        type: DataTypes.TEXT,
      },
      hrComment: {
        type: DataTypes.TEXT,
      },
      noticeStartDate: {
        type: DataTypes.DATEONLY,
      },
      noticeEndDate: {
        type: DataTypes.DATEONLY,
      },
    },
    {
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: false,
    }
  );

  return Resignation;
};
