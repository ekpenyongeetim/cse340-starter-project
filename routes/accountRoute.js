/* ********************************************
 * Account routes
 * unit 4. deliver login view activity
 * ************************************* */
// needed resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

/* ********************************************
 * Account routes
 * unit 4. deliver login view activity
 * ************************************* */
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
