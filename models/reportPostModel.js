const mongoose = require("mongoose");

const reportedSchema = mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },
  count: {
    type: Number,
  },
  Type1: {
    type: Boolean,
    default: false,
  },
  Type2: {
    type: Boolean,
    default: false,
  },
  Type3: {
    type: Boolean,
    default: false,
  },
  Type4: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("reportedPosts", reportedSchema);
