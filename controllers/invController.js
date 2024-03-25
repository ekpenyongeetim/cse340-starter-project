const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

// Controller function to handle requests for the detail view of a specific inventory item
invCont.getInventoryItemDetail = async (req, res) => {
  try {
    const inv_id = req.params.id;
    const inventoryItem = await invModel.getInventoryItem(inv_id);
    const formattedItem = utilities.formatInventoryItemHTML(inventoryItem);
    res.render("inventory/details", {
      title: "Vehicle Details",
      itemHTML: formattedItem,
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Controller function to handle requests for the single view of a specific inventory item
invCont.getSingleView = async (req, res) => {
  try {
    const inv_id = req.params.id;
    const inventoryItem = await invModel.getInventoryById(inv_id);
    if (!inventoryItem) {
      return res.status(404).send("Inventory item not found");
    }
    const formattedHTML = Util.formatInventoryItemHTML(inventoryItem); // Format the inventory item to HTML
    res.render("inventory/singleview", {
      title: `${inventoryItem.inv_make} ${inventoryItem.inv_model}`, // Set the title of the view
      itemHTML: formattedHTML, // Pass the formatted HTML to the view
    });
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    res.status(500).send("Internal Server Error");
  }
};

/* ***************************
 *  Build inventory by single view
 * ************************** */
invCont.buildBySingleViewId = async function (req, res, next) {
  const inv_id = req.params.inventoryId;
  const data = await invModel.getInventoryByInvId(inv_id);
  const grid = await utilities.buildSingleViewGrid(data);
  let nav = await utilities.getNav();
  const className =
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
  res.render("./inventory/singleview", {
    title: className,
    nav,
    grid,
  });
};

invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = invCont;
