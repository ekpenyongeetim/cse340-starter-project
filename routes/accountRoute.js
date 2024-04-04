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

// Process the login attempt. Unity 4
router.post("/login", (req, res) => {
  res.status(200).send("login process");
});

/* ********************************************
 * management view test, to remove later
 * ************************************* */ -router.get(
  "/management",
  utilities.handleErrors(accountController.buildManagementview)
);

module.exports = router;
