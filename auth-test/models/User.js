const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  friends: { type: Array, required: false },
  postedNotes: { type: Array, required: false },
});

// Export function to create "User" model class
module.exports = mongoose.model("User", UserSchema);