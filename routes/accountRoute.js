/* ********************************************
 * Account routes
 * unit 4. deliver login view activity
 * ************************************* */
// needed resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

/* ********************************************
 * Account routes
 * unit 4. deliver login view activity
 * ************************************* */
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

/* ********************************************
 * management view test, to remove later
 * ************************************* */
router.get(
  "/management",
  utilities.handleErrors(accountController.buildManagementview)
);
// Define the default route for account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);

// Apply the checkAccountType middleware to routes that require it
//router.get("/management", checkAccountType, utilities.handleErrors(accountController.buildManagementview));
//router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

module.exports = router;
