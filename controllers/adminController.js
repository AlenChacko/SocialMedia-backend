const adminModel = require("../models/adminModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { validateEmail, validateLength } = require("../helpers/validation");
const reportPostModel = require("../models/reportPostModel");
const mongoose = require("mongoose");
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");

module.exports = {
  //Admin Login
  adminLogin: asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!validateEmail(email)) {
        res.json({ message: "email is incorrect" });
        throw new Error("Email incorrect");
      } else if (!validateLength(password, 6, 16)) {
        res.json({
          message: "Password need minimum 6 or maximum 16 characters",
        });
        throw new Error("Password need minimum 6 or maximum 16 characters");
      } else {
        const admin = await adminModel.findOne({ email });
        if (admin) {
          const adminCheck = await bcrypt.compare(password, admin.password);
          if (adminCheck) {
            const token = jwt.sign(
              { _id: admin._id, email },
              process.env.TOKEN_KEY,
              {
                expiresIn: "24h",
              }
            );
            res.status(200).json({
              email: email,
              token,
            });
          } else {
            res.json({ message: "password incorrect" });
            throw new Error("Password incorrect");
          }
        } else {
          res.json({ message: "Invalid credentials" });
          throw new Error("Invalid credentials");
        }
      }
    } catch (error) {
      res.status(500).json({ message: "error found", error });
    }
  }),

  // Get all reported posts
  reportedPosts: asyncHandler(async (req, res) => {
    try {
      const reportedPosts = await reportPostModel
        .find()
        .populate({ path: "postId", populate: { path: "userId" } });
      if (reportedPosts) {
        res.status(200).json(reportedPosts);
      } else {
        res.json({ message: "no posts are reported" });
      }
    } catch (error) {
      res.status(500).json({ message: "error found", error });
    }
  }),

  //Remove reported posts
  removeReportedPost: asyncHandler(async (req, res) => {
    try {
      const postId = mongoose.Types.ObjectId(req.body.postId);
      const post = await postModel.findByIdAndUpdate(
        { _id: postId },
        {
          deleteVisibility: true,
        }
      );
      const deleteReportedPost = await reportPostModel.deleteOne({
        postId: postId,
      });
      res.status(200).json({ message: "Removed" });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "error found", error });
    }
  }),

  //Declining request for reported posts
  declineReportRequest: asyncHandler(async (req, res) => {
    try {
      const postId = mongoose.Types.ObjectId(req.params.id);
      const decline = await reportPostModel.deleteOne({ postId: postId });
      res.status(200).json({ decline, message: "Declined" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ messsage: "error found", error });
    }
  }),

  //Get all users
  getUsers: asyncHandler(async (req, res) => {
    try {
      const users = await userModel.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error found", error });
    }
  }),

  //User Management
  userAction: asyncHandler(async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.params.id);
      const user = await userModel.findOne({ _id: userId });
      if (!user.accessDenied) {
        const block = await userModel.updateOne(
          { _id: userId },
          { accessDenied: true }
        );
        res.status(200).json({ message: "blocked" });
      } else {
        const block = await userModel.updateOne(
          { _id: userId },
          { accessDenied: false }
        );
        res.status(200).json({ message: "activate" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error found", error });
    }
  }),
};
