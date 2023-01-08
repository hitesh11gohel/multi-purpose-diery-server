var express = require("express");
var router = express.Router();
const { login, logout } = require("../controllers/userController");
// const Auth = require("../middlewares/auth"); // Middlewares

router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
