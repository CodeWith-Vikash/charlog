const mongoose = require("mongoose");

// Schema for a user's basic information
const userInfoSchema = mongoose.Schema({
  userId: { type: String, required: true },
  avatar: { type: String, default: "/user.jfif" },
  username: { type: String, required: true },
});

// Schema for followers/following (which might have nested structures)
const followerSchema = mongoose.Schema({
  userId: { type: String, required: true },
  avatar: { type: String, default: "/user.jfif" },
  username: { type: String, required: true },
  following: [userInfoSchema],  // Reference to other users this user is following
  followers: [userInfoSchema],  // Reference to other users following this user
});

// Main User schema
const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "/user.jfif" },
  followers: [followerSchema],
  following: [followerSchema],
});

module.exports = mongoose.model("User", userSchema);
