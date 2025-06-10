module.exports = (sequelize, Sequelize) => {
    const UserPersonalInfo = sequelize.define("user_personal_info", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: true
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 18,
          max: 100
        }
      },
      gender: {
        type: Sequelize.ENUM,
        values: ['Male', 'Female', 'Other'],
        allowNull: true
      },
      maritalStatus: {
        type: Sequelize.ENUM,
        values: ['Married', 'Single', 'Divorced', 'Widowed'],
        allowNull: true
      },
      fatherName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Government IDs
      aadharNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [12, 12]
        }
      },
      panNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          is: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
        }
      },
      passportNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      drivingLicense: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Contact Details
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [10, 10]
        }
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isEmail: true
        }
      }
    }, {
        timestamps: false,
        freezeTableName: true,
        underscored: true
    });
  
    return UserPersonalInfo;
  };