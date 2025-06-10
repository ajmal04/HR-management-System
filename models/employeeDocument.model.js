module.exports = (sequelize, Sequelize) => {
  const EmployeeDocument = sequelize.define("employeeDocument", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    documentType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fileName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    filePath: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    uploadedBy: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    uploadDate: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  return EmployeeDocument;
};
