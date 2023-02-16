const mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: true },
    password: { type: String, required: true },
    address: { type: String },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    profile: { type: String, default: "" },
    role: { type: String, default: "user" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
