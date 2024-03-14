/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
// New require statement for the inventory route file
const inventoryRoute = require("./routes/inventoryRoute"); // Update the file name accordingly

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
// Inventory routes
app.use("/inv", inventoryRoute);

/* ***********************
 * Routes
 *************************/
/* ******************************************
 * Default GET route
 * ***************************************** */

app.use(static);

//app.get("/", function (req, res) {
//  res.render("index", { title: "Home Page" });
//});

app.get("/", baseController.buildHome);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
