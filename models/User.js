const mongoose = require("mongoose");

/* 
  @User
      email type String required
      username type String required
      password type String required
      profile_picture type String required
      articles type [ObjectId]  not required
      session_token type String required
*/

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    profile_picture: {
      type: String,
      required: true,
    },

    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Article",
      },
    ],

    session_token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
