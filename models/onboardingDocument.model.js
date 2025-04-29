module.exports = (sequelize, Sequelize) => {
    const OnboardingDocument = sequelize.define("onboardingDocument", {
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
        documentType: {
            type: Sequelize.ENUM(
                'ID_PROOF',
                'EDUCATIONAL_CERTIFICATES',
                'EXPERIENCE_LETTERS',
                'BANK_DETAILS',
                'TAX_DOCUMENTS',
                'OTHER'
            ),
            allowNull: false
        },
        fileName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        filePath: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('pending', 'verified', 'rejected'),
            allowNull: false,
            defaultValue: 'pending'
        },
        uploadedBy: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        verifiedBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        uploadDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        verificationDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        comments: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        expiryDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    });
    
    return OnboardingDocument;
}; 