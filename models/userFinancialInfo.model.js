module.exports = (sequelize, Sequelize) => {
    const UserFinancialInfo = sequelize.define("user_financial_info", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      employmentType: {
        type: Sequelize.ENUM,
        values: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'],
        allowNull: true
      },
      salaryBasic: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "Basic salary cannot be negative"
          }
        }
      },
      salaryGross: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "Gross salary cannot be negative"
          }
        }
      },
      salaryNet: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "Net salary cannot be negative"
          }
        }
      },
      allowanceHouseRent: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "House rent allowance cannot be negative"
          }
        }
      },
      allowanceMedical: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "Medical allowance cannot be negative"
          }
        }
      },
      allowanceSpecial: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "Special allowance cannot be negative"
          }
        }
      },
      allowanceFuel: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "Fuel allowance cannot be negative"
          }
        }
      },
      allowancePhoneBill: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "Phone bill allowance cannot be negative"
          }
        }
      },
      allowanceOther: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "Other allowance cannot be negative"
          }
        }
      },
      allowanceTotal: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "Total allowance cannot be negative"
          }
        }
      },
      deductionProvidentFund: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "Provident fund deduction cannot be negative"
          }
        }
      },
      deductionTax: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "Tax deduction cannot be negative"
          }
        }
      },
      deductionOther: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "Other deduction cannot be negative"
          }
        }
      },
      deductionTotal: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 0,
            msg: "Total deduction cannot be negative"
          }
        }
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      accountName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [9, 20],
            msg: "Bank account number must be between 9 and 20 digits"
          }
        }
      },
      ifscCode: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[A-Z]{4}0[A-Z0-9]{6}$/,
            msg: "IFSC code must be in the format: ABCD0123456 (4 letters, 0, 6 alphanumeric characters)"
          }
        }
      }
    }, {
        timestamps: false,
        freezeTableName: true,
        underscored: true
    });
  
    return UserFinancialInfo;
  };