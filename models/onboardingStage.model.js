module.exports = (sequelize, Sequelize) => {
    const OnboardingStage = sequelize.define("onboardingStage", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        requestId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        stageName: {
            type: Sequelize.ENUM(
                'HR_VERIFIED',
                'IT_SETUP',
                'HOD_REVIEW',
                'PRINCIPAL_APPROVAL',
                'COMPLETED'
            ),
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('pending', 'in_progress', 'completed', 'rejected'),
            allowNull: false,
            defaultValue: 'pending'
        },
        assignedTo: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        completedBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        startDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        dueDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        completedDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        comments: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        requirements: {
            type: Sequelize.JSON,
            allowNull: true,
            defaultValue: []
        },
        checklist: {
            type: Sequelize.JSON,
            allowNull: true,
            defaultValue: []
        }
    });
    
    return OnboardingStage;
}; 