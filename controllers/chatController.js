const asyncHandler = require("express-async-handler");
const messageModel = require("../models/messageModel");
const mongoose = require("mongoose");

module.exports = {
  //Add message for room id
  addMessageForRoomId: asyncHandler(async (req, res) => {
    try {
      const authorId = mongoose.Types.ObjectId(req.body.userId);
      const receiverId = mongoose.Types.ObjectId(req.body.value._id);
      const checkRoom = await messageModel.findOne({
        users: {
          $all: [authorId, receiverId],
        },
      });
      // .populate("users");
      if (!checkRoom) {
        const saveMessage = await messageModel.create({
          users: [authorId, receiverId],
        });
        saveMessage.save();
        res.json(saveMessage);
      } else {
        console.log("room already created");
        res.json(checkRoom);
      }
    } catch (error) {
      res.status(500).json({ message: "error found" });
    }
  }),

  //Add message
  addMessage: asyncHandler(async (req, res) => {
    try {
      const authorId = mongoose.Types.ObjectId(req.body.messageData.authorId);
      const receiverId = mongoose.Types.ObjectId(req.body.messageData.receiver);
      let messageData = req.body.messageData;
      if (messageData.message) {
        const checkRoom = await messageModel
          .findOne({
            users: {
              $all: [authorId, receiverId],
            },
          })
          .populate("users");
        if (!checkRoom) {
          const saveMessage = await messageModel.create({
            users: [authorId, receiverId],
            messages: [
              {
                roomId: messageData.room,
                author: messageData.author,
                authorId: messageData.authorId,
                message: messageData.message,
                receiver: messageData.receiver,
                time: messageData.time,
              },
            ],
          });
          saveMessage.save();
          res.status(200).json(saveMessage);
        } else {
          const updateRoom = await messageModel.updateOne(
            {
              users: {
                $all: [authorId, receiverId],
              },
            },
            {
              $push: {
                messages: [
                  {
                    roomId: messageData.room,
                    author: messageData.author,
                    authorId: messageData.authorId,
                    message: messageData.message,
                    time: messageData.time,
                  },
                ],
              },
            }
          );
          res.status(200).json(updateRoom);
        }
      } else {
        res.json({ message: "add some message" });
      }
    } catch (error) {
      res.status(500).json({ error, message: "errorrroroorooroor" });
    }
  }),

  //Get messages
  getChat: asyncHandler(async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.user._id);
      console.log(userId);
      const chat = await messageModel
        .find({
          users: { $in: [userId] },
        })
        .populate("users");
      res.status(200).json(chat);
    } catch (error) {
      console.log("error", error);
      res.status(500).json(error);
    }
  }),

  //Get one chat
  getOneChat: asyncHandler(async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.user._id);
      const receiverId = mongoose.Types.ObjectId(req.params.value);
      const chat = await messageModel.findOne({
        users: { $all: [userId, receiverId] },
      });
      if (chat) {
        res.json(chat);
      } else {
        const saveMessage = await messageModel.create({
          users: [authorId, receiverId],
        });
        saveMessage.save();
        res.json(saveMessage);
      }
    } catch (error) {
      res.status(500).json({ message: "error found" });
    }
  }),
};
