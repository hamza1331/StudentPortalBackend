const mongoose = require('mongoose');


const Activity = new mongoose.Schema({
    firebaseUID:{
        type:String,
        required:true
    },
    chats:{
        type:[String]
    }
});

module.exports = mongoose.model('Activity', Activity);