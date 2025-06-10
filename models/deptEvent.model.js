module.exports = (sequelize, Sequelize) => {
  const DeptEvent = sequelize.define(
    "department_event",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      eventName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      eventDescription: {
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
      createdByUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      departmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      underscored: true,
      freezeTableName: true,
    }
  );

  return DeptEvent;
};
