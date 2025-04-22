module.exports = (sequelize, Sequelize) => {
    const OnboardingRequest = sequelize.define("onboardingRequest", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        userId: {  // Explicitly define userId in the model
            type: Sequelize.INTEGER,
            allowNull: false 
        },
        requestDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        currentStage: {
            type: Sequelize.ENUM(
                'HR_VERIFIED',
                'IT_SETUP',
                'HOD_REVIEW',
                'PRINCIPAL_APPROVAL',
                'COMPLETED'
            ),
            allowNull: false,
            defaultValue: 'HR_VERIFIED'
        },
        status: {
            type: Sequelize.ENUM('pending', 'in_progress', 'completed', 'rejected'),
            allowNull: false,
            defaultValue: 'pending'
        },
        requestedBy: {    // Super Admin who initiated
            type: Sequelize.INTEGER,
            allowNull: false
        },
        completedBy: {    // System Admin who completed
            type: Sequelize.INTEGER,
            allowNull: true
        },
        completionDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        stageHistory: {
            type: Sequelize.JSON,
            allowNull: true,
            defaultValue: []
        },
        comments: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        dueDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        college: {
            type: Sequelize.ENUM(
                'Engineering',
                'Pharmacy', 
                'Nursing',
                'Allied_Health_Science',
                'Medical_Science_Research'
            ),
            allowNull: false
        },
        departmentId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });
    
    return OnboardingRequest;
};
