const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    description: {
      type: String,
    },
    image: {
      type: Array,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [
      {
        comment: {
          type: String,
        },
        commentBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        createdAt: {
          type: String,
          default: new Date(),
        },
      },
    ],
    deleteVisibility: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("posts", postSchema);
