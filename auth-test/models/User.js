const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, maxLength: 25, minLength: 3, required: true },
  password: { type: String, required: true },
  postedNotes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
  likedNotes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
  favoritedNotes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
  commentedNotes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
  friends: {
    requested: [{
      user: { type: Schema.Types.ObjectId, ref: "User" },
      dateRequested: { type: Date, default: Date.now }
    }],
    accepted: [{
      user: { type: Schema.Types.ObjectId, ref: "User" },
      dateAccepted: { type: Date, default: Date.now }
    }],
  }
});

// Export function to create "User" model class
module.exports = mongoose.model("User", UserSchema);