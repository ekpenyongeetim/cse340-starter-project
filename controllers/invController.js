const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);

  // Check if data is empty or undefined
  if (!data || data.length === 0) {
    // Handle the case when there is no data
    // For example, you can render an error message or redirect to another page
    return res
      .status(404)
      .send("No data found for the given classification ID");
  }
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
    const inv_id = req.params.inventoryId;
    const inventoryItem = await invModel.getInventoryById(inv_id);
    console.log(inventoryItem);
    if (!inventoryItem) {
      return res.status(404).send("Inventory item not found");
    }
    let nav = await utilities.getNav();
    const formattedHTML = utilities.formatInventoryItemHTML(inventoryItem); // Format the inventory item to HTML
    res.render("inventory/singleview", {
      title: `${inventoryItem.inv_make} ${inventoryItem.inv_model}`, // Set the title of the view
      formattedHTML, // Pass the formatted HTML to the view
      nav, // pas the nav variable into ejs
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

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  try {
    const results = await invModel.addNewClassification(classification_name);
    const nav = await utilities.getNav(); // corrected the model name
    if (results) {
      req.flash("notice", "Classification added successfully.");
      res.render("inventory/management", { nav, title: "Add Classification" });
    } else {
      req.flash("error", { text: "Failed to add classification." });
      res.render("inventory/add-classification", {
        nav,
        title: "Add Classification",
      });
    }
  } catch (error) {
    next(error);
  }
};

invCont.addInventoryGet = async function (req, res, next) {
  try {
    let dropdown = await utilities.buildClassificationDropdown();
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      dropdown,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
  });
};

invCont.addInventoryPost = async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  try {
    const results = await invModel.addNewInventory(
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );
    const dropdown = await utilities.buildClassificationDropdown();
    const nav = await utilities.getNav(); // corrected the model name
    if (results) {
      req.flash("notice", "Inventory added successfully.");
      res.redirect("/inv/");
    } else {
      req.flash("error", "Failed to add inventory.");
      res.render("inventory/add-inventory", {
        nav,
        dropdown,
        title: "Add Inventory",
      });
    }
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build delete view
 * ************************** */
invCont.confirmDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Delete inventory Item
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);

  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult) {
    req.flash("notice", "The deletion was succesfull.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect("/inv/delete/inv_id");
  }
};

module.exports = invCont;
