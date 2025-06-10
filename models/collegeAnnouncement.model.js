// Replace deptAnnouncement.model.js content with this:
module.exports = (sequelize, Sequelize) => {
  const CollegeAnnouncement = sequelize.define(
    "college_announcement",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      announcementTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      announcementDescription: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdByUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      college: {
        type: Sequelize.ENUM,
        values: [
          "Engineering",
          "Pharmacy",
          "Nursing",
          "Allied_Health_Science",
          "Medical_Science_Research",
          "Educational Institution",
        ],
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

  return CollegeAnnouncement;
};
