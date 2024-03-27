// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// build and post the classification to the nav
// router.get("/add-classification", invController.buildAddClassification);

router.get("/detail/:inventoryId", invController.getSingleView);
module.exports = router;
