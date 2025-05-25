module.exports = (sequelize, DataTypes) => {
  const JobApplication = sequelize.define("JobApplication", {
    jobId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    education: { type: DataTypes.STRING },
    experience: { type: DataTypes.STRING },
    resumePath: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM("Pending", "Shortlisted", "Rejected"),
      defaultValue: "Pending",
    },
  });

  return JobApplication;
};
