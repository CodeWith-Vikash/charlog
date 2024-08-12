const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "/user.jfif",
  },
  followers: [
    {
      userId: String,
      avatar: String,
      username: String,
      following: [
        {
          userId: String,
          avatar: String,
          username: String,
        },
      ],
      followers: [
        {
          userId: String,
          avatar: String,
          username: String,
        },
      ],
    },
  ],
  following: [
    {
      userId: String,
      avatar: String,
      username: String,
      following: [
        {
          userId: String,
          avatar: String,
          username: String,
        },
      ],
      followers: [
        {
          userId: String,
          avatar: String,
          username: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
