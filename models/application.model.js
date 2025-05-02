module.exports = (sequelize, Sequelize) => {
    const Application = sequelize.define("application", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        type: {
            type: Sequelize.ENUM,
            values: [
                'annual_leave',
                'sick_leave',
                'medical_leave',
                'maternity_paternity',
                'bereavement_leave',
                'business_trip',
                'remote_work',
                'training',
                'personal_development',
                'volunteer',
                'other'
            ],
            allowNull: false
        },
        reason: {
            type: Sequelize.STRING,
            allowNull: true
        },
        startDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        endDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM,
            values: ['Approved', 'Rejected', 'Pending'],
            defaultValue: 'Pending',
            allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true, // Recommended to keep track of creation/update
        underscored: true,
        freezeTableName: true,
    });

    return Application;
};