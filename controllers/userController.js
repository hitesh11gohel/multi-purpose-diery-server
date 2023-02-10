const { UserModel } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  const { name, username, email, mobile, password } = req.body;
  const url = req.protocol + "://" + req.get("host");
  if (!name || !username || !email || !mobile || !password) {
    return res.status(404).json({ error: "required fields not provided" });
  }
  try {
    const userExist = await UserModel.findOne({ email: email });
    let imageData;
    if (req.file) {
      imageData = url + "/userProfiles/" + req.file.filename;
    }
    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = new UserModel({
        ...req.body,
        profile: imageData ? imageData : "",
        password: hashedPassword,
      });
      const response = await data.save();
      res.status(201).json({
        response: "Success",
        message: "User registered successfully",
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
    let imageData;
    const url = req.protocol + "://" + req.get("host");
    if (req.file) {
      imageData = url + "/userProfiles/" + req.file.filename;
    }
    const data = await UserModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, profile: imageData ? imageData : "" },
      { new: true }
    );
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
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    const user = await UserModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { _id: user._id, email },
        process.env.COOKIE_SECRET,
        { expiresIn: "1h" }
      );
      user.token = token;
      return res.status(200).json({
        message: "Login successful",
        user: {
          email: user.email,
          token: user.token,
          name: user.name,
          username: user.username,
          mobile: user.mobile,
          address: user.address,
          state: user.state,
          country: user.country,
          profile: user.profile,
          id: user._id,
        },
        loggedInAt: new Date().toISOString(),
      });
    }
    return res.status(400).json({ message: "Invalid Credentials" });
  } catch (err) {
    res.status(500).json({ response: "failed", err: err });
  }
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
