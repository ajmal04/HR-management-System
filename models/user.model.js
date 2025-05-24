module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        unique: {
          args: "username",
          msg: "This username is already taken!",
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jobPosition: {
        type: Sequelize.ENUM,
        values: [
          "HR",
          "PRINCIPAL",
          "HOD",
          "SYSTEM_ADMIN",
          "ASSOCIATE_PROFESSOR",
          "ASSISTANT_PROFESSOR",
        ],
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM,
        values: [
          "ROLE_SUPER_ADMIN",
          "ROLE_SYSTEM_ADMIN",
          "ROLE_ADMIN",
          "ROLE_HOD",
          "ROLE_FACULTY",
        ],
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
        ],
        allowNull: true, // Changed from false to true
      },
      departmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      timestamps: false,
      underscored: true,
      freezeTableName: true,
    }
  );

  return User;
};
