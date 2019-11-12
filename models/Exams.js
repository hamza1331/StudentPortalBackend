const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name:{
        type:String
    }
})

const ExamsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    subjects:{
        type:[subjectSchema]
    }
});

module.exports = mongoose.model('Exams', ExamsSchema);