module.exports = (sequelize, Sequelize) => {
    const Department = sequelize.define("department", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        departmentName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        college: {
            type: Sequelize.ENUM,
            values: [
              'Engineering',
              'Pharmacy',
              'Nursing',
              'Allied_Health_Science',
              'Medical_Science_Research',
              'Na'
            ],
            allowNull: true
        }
    }, {
        timestamps: false,
        underscored: true,
        freezeTableName: true
    });

    return Department;
};