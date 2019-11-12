const mongoose = require('mongoose');
const examSchema = new mongoose.Schema({
    name:{
        type:String
    },
    Subjects:[String],
    startDate:{
        type:Date
    }
})
const studySchema = new mongoose.Schema({
    name:{
        type:String
    },
    institution:{
        type:String
    }
})
const StudentSchema = new mongoose.Schema({
  firebaseUID:{
      type:String,
      unique:true
  },
  offerRate:{
      type:Number
  },
  exam:[examSchema],
  yearOfStudy:{
      type:Number
  },
  Region:[String],
  currentStudy:studySchema
});

module.exports = mongoose.model('Students', StudentSchema);