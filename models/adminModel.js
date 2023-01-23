const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      text: true,
    },
    lastname: {
      type: String,
      text: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", adminSchema);
