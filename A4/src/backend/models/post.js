const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  bid: { type: String, required: true },
  skills: { type: String, required: true },
  duration: { type: String, required: true },
});

module.exports = mongoose.model("Post", postSchema);
