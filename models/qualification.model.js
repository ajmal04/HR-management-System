module.exports = (sequelize, Sequelize) => {
    const Qualification = sequelize.define("qualification", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      highestQualification: {
        type: Sequelize.ENUM,
        values: ['PhD', 'Master\'s Degree', 'Bachelor\'s Degree', 'Diploma', 'High School'],
        allowNull: true
      },
      university: {
        type: Sequelize.STRING,
        allowNull: true
      },
      graduationYear: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1950,
          max: new Date().getFullYear()
        }
      },
      fieldOfStudy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gpa: {
        type: Sequelize.FLOAT,
        allowNull: true,
        validate: {
          min: 0,
          max: 4
        }
      },
      certifications: {
        type: Sequelize.JSON,
        allowNull: true
      },
      educationalCertificatesUrl: {
        type: Sequelize.JSON,
        allowNull: true
      },
      experienceCertificatesUrl: {
        type: Sequelize.JSON,
        allowNull: true
      }
    }, {
        timestamps: false,
        freezeTableName: true,
        underscored: true
    });
  
    return Qualification;
  }; 