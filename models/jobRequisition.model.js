const { DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const JobRequisition = sequelize.define("JobRequisition", {
    jobTitle: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    vacancies: { type: DataTypes.INTEGER, allowNull: false },
    jobType: { type: DataTypes.STRING }, // Full-Time, Part-Time, Contract
    qualification: { type: DataTypes.STRING },
    experience: { type: DataTypes.STRING },
    reason: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected", "Posted"),
      defaultValue: "Pending",
    },
    createdBy: { type: DataTypes.INTEGER }, // User ID
  });

  return JobRequisition;
};
