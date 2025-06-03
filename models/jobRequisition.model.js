const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const JobRequisition = sequelize.define("JobRequisition", {
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    positionTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vacancies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    collegeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Pending", // Status: Pending, Approved by Admin, Approved by SuperAdmin
    },
  });

  return JobRequisition;
};
