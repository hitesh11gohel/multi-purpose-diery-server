const passport = require("passport");
const { UserModel } = require("../models");
const bcrypt = require("bcrypt");

exports.create = async (req, res) => {
  const { name, username, email, mobile, password } = req.body;
  if (!name || !username || !email || !mobile || !password) {
    return res.status(404).json({ error: "required fields not provided" });
  }
  try {
    const userExist = await UserModel.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = new UserModel({ ...req.body, password: hashedPassword });
      const response = await data.save();
      res.status(201).json({
        response: "Success",
        message: "User registered successfully",
        sessionData: req.session,
        data: response,
      });
    }
  } catch (err) {
    res.status(500).json({ response: "failed", err: err });
  }
};

exports.get = async (req, res) => {
  try {
    const data = await UserModel.find({});
    const totalRecord = await UserModel.count();
    res.status(200).json({ total: totalRecord, data: data });
  } catch (err) {
    res.status(500).json({ response: "failed", err: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await UserModel.findById({ _id: req.params.id });
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ response: "failed", err: err });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      response: "Success",
      message: "User updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({ response: "failed", err: err });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const data = await UserModel.findByIdAndRemove(req.params.id);
    res.status(200).json({
      response: "Success",
      message: "User deleted successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({ response: "failed", err: err });
  }
};

// login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ error: "required fields not provided" });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res.status(401).json({ message: info.message, error: err });
      return next(err);
    }

    if (!user) {
      res.status(404).json({ message: info.message, error: err });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json({
          message: "Login successful",
          user: user,
          loggedInAt: new Date().toISOString(),
        });
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.json({
      message: "Logout successful",
      loggedOutAt: new Date().toISOString(),
    });
  });
};
