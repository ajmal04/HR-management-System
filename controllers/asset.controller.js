const db = require("../models");
const Asset = db.asset;
const AssetAllocation = db.assetAllocation;
const User = db.user;
const { Op } = require("sequelize");

// Create and Save a new Asset
exports.create = async (req, res) => {
    try {
        // Validate request
        if (!req.body.assetName || !req.body.assetType) {
            return res.status(400).send({
                message: "Asset name and type are required!"
            });
        }

        // Create an Asset
        const asset = {
            assetName: req.body.assetName,
            assetType: req.body.assetType,
            assetSerialNumber: req.body.assetSerialNumber,
            status: 'available',
            purchaseDate: req.body.purchaseDate,
            purchasePrice: req.body.purchasePrice,
            supplier: req.body.supplier,
            warrantyExpiry: req.body.warrantyExpiry,
            notes: req.body.notes
        };

        // Save Asset in the database
        const data = await Asset.create(asset);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Asset."
        });
    }
};

// Retrieve all Assets
exports.findAll = async (req, res) => {
    try {
        const data = await Asset.findAll();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving assets."
        });
    }
};

// Find a single Asset with an id
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Asset.findByPk(id);
        
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Asset with id=${id}.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Asset with id=" + req.params.id
        });
    }
};

// Update an Asset by the id
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await Asset.update(req.body, {
            where: { id: id }
        });

        if (num == 1) {
            res.send({
                message: "Asset was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Asset with id=${id}. Maybe Asset was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Asset with id=" + req.params.id
        });
    }
};

// Delete an Asset with the specified id
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await Asset.destroy({
            where: { id: id }
        });

        if (num == 1) {
            res.send({
                message: "Asset was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Asset with id=${id}. Maybe Asset was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Asset with id=" + req.params.id
        });
    }
};

// Get available assets
exports.getAvailable = async (req, res) => {
    try {
        const data = await Asset.findAll({
            where: { status: 'available' }
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving available assets."
        });
    }
};

// Get assets by user
exports.getUserAssets = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // First check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get all active allocations for the user
        const allocations = await AssetAllocation.findAll({
            where: { 
                userId: userId,
                status: 'active'
            },
            include: [{
                model: Asset,
                as: 'asset',
                attributes: ['id', 'assetName', 'assetType', 'assetSerialNumber', 'status']
            }]
        });

        if (!allocations || allocations.length === 0) {
            return res.status(200).json([]);
        }

        // Map the allocations to include both allocation and asset data
        const userAssets = allocations.map(allocation => ({
            id: allocation.asset.id,
            assetName: allocation.assetName || allocation.asset.assetName,
            assetType: allocation.assetType || allocation.asset.assetType,
            assetSerialNumber: allocation.assetSerialNumber || allocation.asset.assetSerialNumber,
            status: allocation.asset.status,
            allocationId: allocation.id,
            allocatedOn: allocation.allocatedOn,
            collectedOn: allocation.collectedOn
        }));

        res.status(200).json(userAssets);
    } catch (err) {
        res.status(500).json({ 
            message: 'Failed to retrieve user assets',
            error: err.message
        });
    }
};

// Bulk assign assets to a user
exports.bulkAssign = async (req, res) => {
    const { userId, assetIds } = req.body;

    if (!userId || !assetIds || !Array.isArray(assetIds)) {
        return res.status(400).json({ message: 'User ID and array of asset IDs are required' });
    }

    const t = await db.sequelize.transaction();

    try {
        // Get user details
        const user = await User.findByPk(userId);
        if (!user) {
            await t.rollback();
            return res.status(404).json({ message: 'User not found' });
        }

        // Get all assets to be assigned
        const assets = await Asset.findAll({
            where: {
                id: assetIds,
                status: 'available'
            }
        });

        if (assets.length !== assetIds.length) {
            await t.rollback();
            return res.status(400).json({ message: 'One or more assets are not available' });
        }

        // Create allocations for each asset
        const allocations = await Promise.all(assets.map(asset => 
            AssetAllocation.create({
                userId,
                assetId: asset.id,
                assetName: asset.assetName,
                assetType: asset.assetType,
                status: 'active',
                assignedBy: req.user.id,
                assignedDate: new Date()
            }, { transaction: t })
        ));

        // Update asset statuses
        await Promise.all(assets.map(asset =>
            asset.update({ status: 'assigned' }, { transaction: t })
        ));

        await t.commit();

        res.status(200).json({
            message: 'Assets assigned successfully',
            allocations
        });
    } catch (error) {
        await t.rollback();
        console.error('Error in bulk asset assignment:', error);
        res.status(500).json({ message: 'Failed to assign assets', error: error.message });
    }
}; 