const express = require("express");
const router = express.Router();
const {
  getExpenseById,
  getAllExpense,
  updateExpense,
  deleteExpense,
  createExpense,
} = require("../controllers/expenseController");
const Auth = require("../middlewares/auth"); // Middlewares
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "upload",
  filename: (req, file, cb) => {
    const fileName = `${file.fieldname}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});
let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.get("/get-all", Auth, getAllExpense);
router.post("/add", upload.single("image"), createExpense);
router.get("/get/:id", getExpenseById);
router.patch("/update/:id", updateExpense);
router.delete("/delete/:id", deleteExpense);

module.exports = router;
