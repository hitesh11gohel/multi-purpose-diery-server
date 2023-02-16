const { ExpenseModel } = require("../models");

// if (!req.session.users) {
//   req.session.users = {};
// }
// let users = req.session.users;
// if (!users[req.body._id]) {
//   users[req.body._id] = req.body;
// } else {
//   users[req.body._id] = req.body;
// }

// to Update all field name's type
// await ExpenseModel.updateMany({}, [ { $set: { userId: { $toObjectId: "63cf9d8315687dc4209a0e76" } } } ]);
// await ExpenseModel.updateMany({ userId: "63edc45424c82aa9fac4d4cf" }, [ { $set: { userId: { $toObjectId: "63edc45424c82aa9fac4d4cf" } } } ]);

// to deleted all documents
// const deletedData = await ExpenseModel.deleteMany( { userId : "63b800d7625455e857633afa" } );

// to insert new entries
// const insertedData = await ExpenseModel.insertMany(dummyUserData);

// to find and update all documents
// const isUpdated = await ExpenseModel.updateMany(
//   { userId: "63b800d7625455e857633afa" },
//   { $set: { userId: { $toObjectId: "63b800d7625455e857633afa" } } }
// );

exports.getAllExpense = async (req, res) => {
  try {
    const data = await ExpenseModel.find({ userId: req.user._id }).sort([
      ["date", -1],
    ]);
    const total = await ExpenseModel.count({ userId: req.user._id });
    res.status(200).json({
      response: "success",
      total: total,
      data: data,
    });
  } catch (e) {
    res.status(500).json({ response: "Failed", err: e });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const data = await ExpenseModel.findById({ _id: req.params.id });
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ response: "failed", err: err });
  }
};

exports.createExpense = async (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const { title, address, date, budget } = req.body;
  if (!title || !address || !date || !budget) {
    return res.status(404).json({ error: "required fields not provided" });
  }
  try {
    let imageData;
    if (req.file) {
      imageData = url + "/upload/" + req.file.filename;
    }

    const data = new ExpenseModel({
      ...req.body,
      userId: req.user._id,
      image: imageData ? imageData : "",
    });
    const response = await data.save();
    res.status(201).json({
      response: "Success",
      message: "Expense added successfully ",
      data: response,
    });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const response = await ExpenseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(201).json({
      response: "Success",
      message: "Expense Update successfully ",
      data: response,
    });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const response = await ExpenseModel.findByIdAndRemove(req.params.id);
    res.status(200).json({
      response: "Success",
      message: "Expense deleted successfully",
      data: response,
    });
  } catch (err) {
    res.status(500).json({ response: "failed", err: err });
  }
};
