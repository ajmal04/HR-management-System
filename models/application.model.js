module.exports = (sequelize, Sequelize) => {
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

  return Application;
};
