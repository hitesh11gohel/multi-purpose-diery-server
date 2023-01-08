var express = require("express");
var Users = require("./users-router");
var Expenses = require("./expense-router");
var Authantication = require("./auth-router");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/auth", Authantication);
router.use("/users", Users);
router.use("/expense", Expenses);

module.exports = router;
