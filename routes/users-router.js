var express = require("express");
var router = express.Router();
const {
  create,
  get,
  getById,
  update,
  deleteUser,
} = require("../controllers/userController");
const Auth = require("../middlewares/auth"); // Middlewares

router.post("/add", create);
router.get("/get-all", Auth, get);
router.get("/get/:id", getById);
router.patch("/update/:id", update);
router.delete("/delete/:id", deleteUser);

module.exports = router;
