module.exports = (sequelize, Sequelize) => {
    const AssetAllocation = sequelize.define("asset_allocation", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        assetId: {
            type: Sequelize.INTEGER,
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
        allocatedOn: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        status: {
            type: Sequelize.ENUM('active', 'returned'),
            allowNull: false,
            defaultValue: 'active'
        },
        collectedOn: {
            type: Sequelize.DATE,
            allowNull: true
        }
    });
    
    return AssetAllocation;
};
