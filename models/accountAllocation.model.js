module.exports = (sequelize, Sequelize) => {
    const AccountAllocation = sequelize.define("account_allocation", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        employeeId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        accountType: {
            type: Sequelize.STRING,    // Email, HR Portal, GitHub, etc
            allowNull: false
        },
        accountUsername: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createdOn: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        disabledOn: {
            type: Sequelize.DATE,
            allowNull: true
        }
    });
    
    return AccountAllocation;
};
