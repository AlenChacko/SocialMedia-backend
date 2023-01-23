const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = process.env;

module.exports = {
  userAccess: asyncHandler(async (req, res, next) => {
    try {
      const token = req.headers.token;
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      req.user = decoded;
      const userId = mongoose.Types.ObjectId(req.user._id);
      const user = await userModel.findOne({ _id: userId });
      if (user.accessDenied) {
        res.json({ message: "no access" });
      } else {
        return next();
      }
    } catch (error) {
      res.status(200).json({ message: "error found", error });
    }
  }),
};
