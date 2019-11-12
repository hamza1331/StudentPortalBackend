const mongoose = require('mongoose');
const examSchema = new mongoose.Schema({
    name:{
        type:String
    },
    subjects:String,
    grade:String,
    yearOfAttending:Date
})
const educationSchema = new mongoose.Schema({
    name:{
        type:String
    },
    institue:{
        type:String
    }
})
const tutorSchema = new mongoose.Schema({
  firebaseUID:{
      type:String,
      unique:true
  },
  offerRate:{
      type:Number
  },
  exams:[examSchema],
  Region:[String],
  education:[educationSchema],
  currentStatus:{
      type:Number           //0:Full Time, 1:Part Time, 2:Studying
  },
  description:{
      type:String           //self description of tutor
  },
  title:{
      type:String               //for cards
  }
});

module.exports = mongoose.model('Tutors', tutorSchema);