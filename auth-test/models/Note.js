const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const NoteSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, maxLenght: 20, minLenght: 3 },
  body: { type: String, required: true, maxLenght: 300, minLenght: 3 },
  datePosted: {type: Date, required: true},
  public: {type: Boolean, required: true},
  addressee: { type: Schema.Types.ObjectId, ref: "User", required: false },
});

// Export function to create "User" model class
module.exports = mongoose.model("Note", NoteSchema);