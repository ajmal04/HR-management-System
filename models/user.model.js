module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        unique: {
          args: 'username',
          msg: 'This username is already taken!'
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM,
        values: [
          'ROLE_SUPER_ADMIN',             // 1 HR
          'ROLE_SYSTEM_ADMIN',            // IT Team
          'ROLE_ADMIN',                   // 5 Principals
          'ROLE_HOD',                     // Head of Department
          'ROLE_FACULTY'                  // Faculty Members
        ],
        allowNull: false
      },
      college: {
        type: Sequelize.ENUM,
        values: [
          'Engineering',
          'Pharmacy', 
          'Nursing',
          'Allied_Health_Science',
          'Medical_Science_Research'
        ],
        allowNull: false, // Not required for super admin and system admin

        validate: {
            isCollegeValid(value) {
               if (
                   (this.role === 'ROLE_ADMIN' && !value) ||
                    (['ROLE_SUPER_ADMIN', 'ROLE_SYSTEM_ADMIN'].includes(this.role) && value)
               ) {
                    throw new Error("Invalid college assignment");
               }
            }
        }
      },

      departmentId: {
        type: Sequelize.INTEGER,
        allowNull: true, // allow NULL initially
        validate: {
          isDepartmentRequired(value) {
            if (['ROLE_HOD', 'ROLE_FACULTY'].includes(this.role) && !value) {
              throw new Error('Department ID is required for HOD and Faculty roles.');
            }
          }
        }
      },
      
      active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          validate: {
            notEmpty: true
          }
      }
    }, {
        timestamps: false,
        underscored: true,
        freezeTableName: true
    });
  
    return User;
  };