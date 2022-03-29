const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const accountSchema = mongoose.Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});
accountSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Account", accountSchema);
