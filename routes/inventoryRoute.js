// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const regValidate = require("../utilities/account-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// build and post the classification to the nav
router.get("/add-classification", invController.buildAddClassification);
router.post(
  "/add-classification",
  regValidate.registationAddClassification(),
  regValidate.checkAddClassification,
  invController.addClassification
);

router.get("/detail/:inventoryId", invController.getSingleView);
module.exports = router;
