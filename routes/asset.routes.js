var express = require('express');
var router = express.Router();
const assets = require("../controllers/asset.controller.js");
const { verifyToken } = require("../withAuth");

// Create a new Asset
router.post("/", [verifyToken], assets.create);

// Retrieve all Assets
router.get("/", [verifyToken], assets.findAll);

// Retrieve all available Assets
router.get("/available", [verifyToken], assets.getAvailable);

// Retrieve a single Asset with id
router.get("/:id", [verifyToken], assets.findOne);

// Update a Asset with id
router.put("/:id", [verifyToken], assets.update);

// Delete a Asset with id
router.delete("/:id", [verifyToken], assets.delete);

// Get assets by user
router.get("/user/:userId", [verifyToken], assets.getUserAssets);

// Bulk assign assets to a user
router.post("/assign/bulk", [verifyToken], assets.bulkAssign);

module.exports = router; 