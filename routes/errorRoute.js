// routes/errorRoute.js

const express = require("express");
const router = express.Router();

// Intentional error route
router.get("/trigger-error", (req, res, next) => {
  next(
    new Error(
      "Intentional error for testing. Oh no there was a crash. Maybe try s different route"
    )
  );
});

module.exports = router;
