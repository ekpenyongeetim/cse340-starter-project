const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getQuoteVehicle = async function (req, res, next) {
  let data = await invModel.getInventoryVehicle();
  let list =
    "<label>Vehicle: <br><input list='quote_model' name='quote_model' placeholder = 'Choose a Vehicle' autocomplete='off'></label><br><br>";
  list += "<datalist id='quote_model'>";
  data.rows.forEach((row) => {
    list += "<option value=" + row.inv_model + ">";
    list += "</option>";
  });
  list += "</datalist>";
  return list;
};

Util.formatInventoryItemHTML = function (item) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_price,
    inv_miles,
    inv_color,
  } = item;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(inv_price);
  const formattedMiles = new Intl.NumberFormat().format(inv_miles);
  let html = '<div class="vehicle-details">';
  html += `<img src="${inv_image}" alt="${inv_make} ${inv_model}">`;
  html += `<div class="vehicle-description">`;
  html += `<h2>${inv_make} ${inv_model}</h2>`;
  html += `<p>Year: ${inv_year}</p>`;
  html += `<p class="description">Description: ${inv_description}</p>`;
  html += `<p>Price: ${formattedPrice}</p>`;
  html += `<p>Mileage: ${formattedMiles} miles</p>`;
  html += `<p>Color: ${inv_color}</p>`;
  html += `</div>`;
  html += `</div>`;
  return html;
};

// Function to insert a forward slash (/) between "vehicle" and "thumbnail" in the image URLs
//function insertSlash(url) {
//return url.replace("/vehicles", "/vehicles/");
//}
/***
 * build the drop down menu
 */
Util.buildClassificationDropdown = async function () {
  let dropdown =
    '<select id="classification_id" name="classification_id" class="form-control" required>' +
    '<option value="" selected disabled>Select Classification</option>' +
    "";
  let classifications = await invModel.getClassifications();
  classifications.rows.forEach((classification) => {
    dropdown += '<option value="' + classification.classification_id + '">';
    dropdown += classification.classification_name;
    dropdown += "</option>";
  });
  dropdown += "</select>";
  return dropdown;
};
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
