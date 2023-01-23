const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
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
    phonenumber: {
      type: Number,
    },
    dateofbirth: {
      type: String,
    },
    password: {
      type: String,
    },

    coverimage: {
      type: String,
    },
    profileimage: {
      type: String,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    bio: {
      type: String,
    },
    proffession: {
      type: String,
    },
    livesin: {
      type: String,
    },
    country: {
      type: String,
    },
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
    saved: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    accessDenied: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
