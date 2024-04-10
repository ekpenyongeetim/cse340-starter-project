// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities/");

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

// create and pos the inventory
router.get("/add-inventory", invController.addInventoryGet);
router.post(
  "/add-inventory",
  regValidate.registationAddNewVehicle(),
  regValidate.checkAddNewVehicle,
  invController.addInventoryPost
);

router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.getSingleView)
);

// Get inventory for ajax route
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to handle editing an inventory item
router.get(
  "/edit/:inventory_id",
  utilities.handleErrors(invController.editInventoryView)
);

router.post(
  "/update/",
  regValidate.newInventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to display delete confirmation view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.confirmDeleteView)
);

// Route to handle deleting an inventory item
router.post("/delete/", utilities.handleErrors(invController.deleteItem));

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildManagementView)
);
module.exports = router;
