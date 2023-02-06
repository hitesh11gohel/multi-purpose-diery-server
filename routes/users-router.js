var express = require("express");
var router = express.Router();
const {
  create,
  get,
  getById,
  update,
  deleteUser,
} = require("../controllers/userController");

router.post("/add", create);
router.get("/get-all", get);
router.get("/get/:id", getById);
router.patch("/update/:id", update);
router.delete("/delete/:id", deleteUser);

module.exports = router;
