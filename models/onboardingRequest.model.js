module.exports = (sequelize, Sequelize) => {
    const OnboardingRequest = sequelize.define("onboarding_request", {
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
        status: {
            type: Sequelize.ENUM('pending', 'completed'),
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
        }
    });
    
    return OnboardingRequest;
};
