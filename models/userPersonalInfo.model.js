module.exports = (sequelize, Sequelize) => {
  const UserPersonalInfo = sequelize.define(
    "user_personal_info",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM,
        values: ["Male", "Female"],
        allowNull: true,
      },
      age: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bloodGroup: {
        type: Sequelize.ENUM,
        values: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        allowNull: true,
      },
      tempAddress: {
        type: Sequelize.TEXT, // Changed to TEXT for longer addresses
        allowNull: true,
      },
      maritalStatus: {
        type: Sequelize.ENUM,
        values: ["Married", "Single", "Widowed"],
        allowNull: true,
      },
      fatherName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      idNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      underscored: true,
    }
  );

  return UserPersonalInfo;
};
