const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  firebaseUID:{
      type:String,
      unique:true
  },
  offerRate:{
      type:Number
  },
  exam:String,
  Region:String,
  description:{
      type:String           //Description of post
  },
  studentFirebaseUID:{
      type:String
  },
  studentProfilePic:{
      type:String
  },
  teacherFirebaseUID:{
      type:String
  },
  chatID:{
      type:String
  },
  subject:[String]

});

module.exports = mongoose.model('Posts', postSchema);