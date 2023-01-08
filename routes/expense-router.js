const express = require("express");
const router = express.Router();
const {
  getExpenseById,
  getAllExpense,
  updateExpense,
  deleteExpense,
  createExpense,
} = require("../controllers/expenseController");
// const Auth = require("../middlewares/auth"); // Middlewares

router.get("/get-all", getAllExpense);
router.post("/add", createExpense);
router.get("/get/:id", getExpenseById);
router.patch("/update/:id", updateExpense);
router.delete("/delete/:id", deleteExpense);

module.exports = router;
