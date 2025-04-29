module.exports = (sequelize, Sequelize) => {
    const Asset = sequelize.define("asset", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        assetName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        assetType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        assetSerialNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.ENUM('available', 'assigned', 'maintenance', 'retired'),
            allowNull: false,
            defaultValue: 'available'
        },
        purchaseDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        purchasePrice: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        supplier: {
            type: Sequelize.STRING,
            allowNull: true
        },
        warrantyExpiry: {
            type: Sequelize.DATE,
            allowNull: true
        },
        notes: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        lastMaintenanceDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        nextMaintenanceDate: {
            type: Sequelize.DATE,
            allowNull: true
        }
    });
    
    return Asset;
}; 