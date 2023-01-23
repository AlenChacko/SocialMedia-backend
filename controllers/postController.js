const asyncHandler = require("express-async-handler");
require("dotenv").config();
const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const mongoose = require("mongoose");
const reportPostModel = require("../models/reportPostModel");

module.exports = {
  ///add post
  addPost: asyncHandler(async (req, res) => {
    try {
      const { image, description } = req.body;
      const userId = req.user._id; 
       if (!userId) {
        res.json({ message: "unauthorized" });
        throw new Error("Un authorized");
      } else {
        const date = new Date().toDateString();
        const post = await new postModel({
          description,
          userId,
          image,
          date,
        }).save();
        const addedPost = await postModel
          .findOne({ _id: post._id })
          .populate("userId");
        res.status(200).json(addedPost);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ messsage: "error found" });
    }
  }),

  ///get post
  getPost: asyncHandler(async (req, res) => {
    console.log(req.user);
    try {
      const id = req.user._id;
      const userId = mongoose.Types.ObjectId(id);
      if (!userId) {
        res.json({ message: "no post found" });
        throw new Error("No post found");
      } else {
        const posts = await postModel
          .find({ userId })
          .populate("userId")
          .populate("comments.commentBy")
          .sort({ createdAt: -1 });

        if (posts) {
          res.status(200).json(posts);
        } else {
          res.json({ message: "no posts found" });
          throw new Error("No posts found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }),

  ///like post
  postLike: asyncHandler(async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.body.userid);
      const postid = mongoose.Types.ObjectId(req.body.postid);
      const likedUser = await postModel.findOne({
        _id: postid,
        likes: [userId],
      });
      console.log(likedUser, "userlike");
      if (likedUser) {
        const unlike = await postModel
          .findOneAndUpdate(
            { _id: postid },
            {
              $pull: { likes: [userId] },
            }
          )
          .populate("userId");
        res.status(200).json({ unlike, message: "unliked" });
      } else {
        let liked = await postModel
          .findByIdAndUpdate(
            { _id: postid },
            {
              $push: { likes: [userId] },
            }
          )
          .populate("userId");
        res.status(200).json({ liked, message: "liked" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ messsage: "error found" });
    }
  }),

  ///get likes
  getLikes: asyncHandler(async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.user._id);
      const postid = mongoose.Types.ObjectId(req.headers.postid);
      const likes = await postModel.findById({ _id: postid });
      const totalLikes = likes.likes.length;
      res.status(200).json(totalLikes);
    } catch (error) {
      console.log(error);
      res.status(500).json({ messsage: "error found" });
    }
  }),

  ///add comment
  addComment: asyncHandler(async (req, res) => {
    try {
      const comment = req.body.values.comment;
      const userid = mongoose.Types.ObjectId(req.params.id);
      const postid = mongoose.Types.ObjectId(req.body.postid);
      if (!comment) {
        res.json({ message: "Enter something" });
        throw new Error("Enter something");
      } else {
        const postComment = await postModel
          .findByIdAndUpdate(
            { _id: postid },
            {
              $push: {
                comments: {
                  comment: comment,
                  commentBy: userid,
                },
              },
            }
          )
          .populate("comments.commentBy");
        res.status(200).json(postComment);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ messsage: "error found" });
    }
  }),

  ///delete comment
  deleteComment: asyncHandler(async (req, res) => {
    try {
      const postId = mongoose.Types.ObjectId(req.body.postId);
      const commentId = mongoose.Types.ObjectId(req.body.commentId);
      const post = await postModel.updateOne(
        { _id: postId },
        { $pull: { comments: { _id: commentId } } }
      );
      res.status(200).json({ message: "Comment Deleted" });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Error found", error });
    }
  }),

  ///get user posts
  getUserPost: asyncHandler(async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.params.id);
      const userPosts = await postModel
        .find({ $and: [{ userId: userId }, { deleteVisibility: false }] })
        .populate("userId")
        .populate("comments.commentBy")
        .sort({ createdAt: -1 });
      res.status(200).json(userPosts);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "error found" });
    }
  }),

  ///get following peoples posts
  getAllPosts: asyncHandler(async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.user._id);
      const allPosts = await postModel
        .find({ deleteVisibility: false })
        .populate("userId")
        .populate("comments.commentBy")
        .sort({ createdAt: -1 });
      // const user = await userModel.findOne({ _id: userId });
      res.status(200).json({ allPosts, message: "Post deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ messsage: "error found" });
    }
  }),

  ///delete post
  deletePost: asyncHandler(async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.body.userId);
      const postId = mongoose.Types.ObjectId(req.body.postId);
      const post = await postModel.findOneAndUpdate(
        { $and: [{ _id: postId }, { userId: userId }] },
        {
          $set: {
            deleteVisibility: true,
          },
        }
      );
      res.status(200).json(post);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error found" });
    }
  }),

  ///save post
  savePost: asyncHandler(async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.body.userId);
      const postId = mongoose.Types.ObjectId(req.body.postId);
      const user = await userModel.findOne({
        $and: [
          {
            _id: userId,
          },
          { savedPosts: { $in: [postId] } },
        ],
      });
      if (user) {
        const unSave = await userModel.findOneAndUpdate(
          { _id: userId },
          { $pull: { savedPosts: postId } }
        );
        res.status(200).json({ message: "post unsaved" });
      } else {
        const save = await userModel.findOneAndUpdate(
          { _id: userId },
          {
            $push: { savedPosts: postId },
          }
        );
        res.status(200).json({ message: "post saved" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error found" });
    }
  }),

  ///report post
  reportPost: asyncHandler(async (req, res) => {
    try {
      const reason = req.body.data;
      const postId = mongoose.Types.ObjectId(req.body.postId);
      if (req.body.data === "") {
        res.json({ message: "Choose some thing" });
        throw new Error("Choose some thing");
      } else {
        const reportedPost = await reportPostModel.findOne({ postId: postId });
        if (reportedPost) {
          if (reason === "Type1") {
            const Type1 = await reportPostModel.updateOne(
              { postId: postId },
              {
                Type1: true,
              }
            );
          } else if (reason === "Type2") {
            const Type2 = await reportPostModel.updateOne(
              { postId: postId },
              {
                Type2: true,
              }
            );
          } else if (reason === "Type3") {
            const Type3 = await reportPostModel.updateOne(
              { postId: postId },
              {
                Type3: true,
              }
            );
          } else if (reason === "Type4") {
            const Type4 = await reportPostModel.updateOne(
              { postId: postId },
              {
                Type4: true,
              }
            );
          }
        } else if (reason === "Type1") {
          const saveType1 = await reportPostModel({
            postId: postId,
            Type1: true,
          });
          saveType1.save();
        } else if (reason === "Type2") {
          const saveType2 = await reportPostModel({
            postId: postId,
            Type2: true,
          });
          saveType2.save();
        } else if (reason === "Type3") {
          const saveType3 = await reportPostModel({
            postId: postId,
            Type3: true,
          });
          saveType3.save();
        } else if (reason === "Type4") {
          const saveType4 = await reportPostModel({
            postId: postId,
            Type4: true,
          });
          saveType4.save();
        }
        res.status(200).json({ message: "updated" });
      }
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "error found", error });
    }
  }),
};
