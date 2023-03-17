const mongoose = require("mongoose");

/* 
  @Article
      author type ObjectId required
      title type string required
      body type string required
*/
const articleSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },
  },
  {
    timestapms: true,
  }
);

module.exports = mongoose.model("Article", articleSchema);
