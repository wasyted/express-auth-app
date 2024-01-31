const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true, maxLenght: 300, minLenght: 3 },
  title: { type: String, required: true, maxLenght: 20, minLenght: 3 }
});

// Export function to create "User" model class
module.exports = mongoose.model("Note", NoteSchema);