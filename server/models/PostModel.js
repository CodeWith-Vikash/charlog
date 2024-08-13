const mongoose = require("mongoose");

// UserInfo Schema
const userInfoSchema = mongoose.Schema({
  avatar: { type: String, required: true },
  username: { type: String, required: true },
  userId: { type: String, required: true },
});

// Media Schema
const mediaSchema = mongoose.Schema({
  url: { type: String },
  mediaType: { type: String },
});

// Reply Schema
const replySchema = mongoose.Schema({
  username: String,
  avatar: String,
  reply: String,
  userId: String,
  commentUser: String,
  replyDate: {
    type: Date,
    default: Date.now,
  },
});

// Comment Schema
const commentSchema = mongoose.Schema({
  username: String,
  avatar: String,
  comment: String,
  userId: String,
  replies: [replySchema],
  commentDate: {
    type: Date,
    default: Date.now,
  },
});

// Like Schema
const likeSchema = mongoose.Schema({
  username: String,
  userId: String,
});

// Post Schema
const postSchema = mongoose.Schema({
  userInfo: userInfoSchema,
  title: {
    type: String,
    required: true,
  },
  media: mediaSchema,
  likes: [likeSchema],
  comments: [commentSchema],
  postDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
