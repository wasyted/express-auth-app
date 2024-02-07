const Note = require('../models/Note')
const User = require('../models/User')

exports.likeNote = async function likePost(postID , likerID){
  const likedNote = await Note.findByIdAndUpdate({ postID }).exec();
  if(likedNote != undefined){
    likedNote.interaction.likes = likedNote.interaction.likes + 1;
    await User.findByIdAndUpdate(
      likerID,
      { $push: { likedNotes: likedNote._id } },
      { new: true }
    )
    await likedNote.save();
  }
}