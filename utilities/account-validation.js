const utilities = require(".");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Registration Add Classification Data Validation Rules
 * ********************************* */
validate.registationAddClassification = () => {
  return [
    // firstname is required and must be string
    body("classification_name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a Classification Name. Min 3 characters"), // on error this message is sent.
  ];
};

/* ******************************
 * Check data Add Classification and return errors or continue to registration
 * ***************************** */
validate.checkAddClassification = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};
/*  **********************************
 *  Registration Add New Vehicle Data Validation Rules
 * ********************************* */
validate.registationAddNewVehicle = () => {
  return [
    // market is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 3, max: 10 })
      .withMessage("Please provide a make."), // on error this message is sent.

    // model is required and must be string
    body("inv_model")
      .trim()
      .isLength({ min: 3, max: 10 })
      .withMessage("Please provide a model."), // on error this message is sent.

    // image large is required and must be string
    body("inv_image")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a Image Path."), // on error this message is sent.

    // image short large is required and must be string
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a Thumbnail Path."), // on error this message is sent.

    // price is required and must be integer
    body("inv_price")
      .trim()
      .isInt()
      .isLength({ min: 3, max: 10 })
      .withMessage("Please provide a price."), // on error this message is sent.

    // year is required and must be integer
    body("inv_year")
      .trim()
      .isInt()
      .isLength(4)
      .withMessage("Please provide a year."), // on error this message is sent.

    // miles is required and must be integer
    body("inv_miles")
      .trim()
      .isInt()
      .isLength({ min: 3, max: 10 })
      .withMessage("Please provide a miles."), // on error this message is sent.

    // color is required and must be string
    body("inv_color")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a color."), // on error this message is sent.
  ];
};
/* ******************************
 * Check data  Add New Vehicle and return errors or continue to registration
 * ***************************** */
validate.checkAddNewVehicle = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let grid = await utilities.getClassificationId();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      grid,
      inv_make,
      inv_model,
      inv_year,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Registration Add Request Quote Data Validation Rules
 * ********************************* */
validate.registationRequestQuote = () => {
  return [
    // firstname is required and must be string
    body("quote_firstname")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a Classification Name. Min 3 characters"), // on error this message is sent.

    // lastname is required and must be string
    body("quote_lastname")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a Classification Name. Min 3 characters"), // on error this message is sent.

    // mail is required and must be string
    body("quote_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (quote_email) => {
        const emailExists = await accountModel.checkExistingEmailQuote(
          quote_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),
  ];
};

/* ******************************
 * Check Request Quote data and return errors or continue to registration
 * ***************************** */
validate.checkRequestQuote = async (req, res, next) => {
  const { quote_firstname, quote_lastname, quote_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let grid = await utilities.getQuoteVehicle();
    res.render("account/requestQuote", {
      errors,
      title: "Request Quote",
      nav,
      grid,
      quote_firstname,
      quote_lastname,
      quote_email,
    });
    return;
  }
  next();
};

module.exports = validate;
