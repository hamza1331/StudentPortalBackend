const express = require('express')
var http = require('http');

const app = express()
var server = http.createServer(app);
const process = require('process')
const bodyParser = require('body-parser')
const User = require('./models/User')
const Teacher = require('./models/TeacherProfile')
const Student = require('./models/StudentProfile')
const Region = require('./models/Regions')
const Exam = require('./models/Exams')
const mongoose = require('mongoose')
const url = 'mongodb://demo:demo123@ds245018.mlab.com:45018/studentportal'
const port = process.env.PORT || 5000
const cors = require('cors')
const client = require('socket.io').listen(server).sockets;
app.use(bodyParser.json())  //Body Parser MiddleWare
app.use(express.json())
app.use(cors())
app.use(bodyParser())
function handleErr(err){
    if(err)return{
        message:"Failed",
        err
    }   
   }
   function handleSuccess(data){
       if(data)return{
           message:"Success",
           doc:data
       }
   }

mongoose.connect(url, { useNewUrlParser: true }) //MongoDB connection using Mongoose
var db = mongoose.connection //Mongo Connection Instance
db.on('open', () => console.log('database connected'))  

app.post('/api/addUser', (req, res) => {
    const user = req.body
    User.create(user, (err, doc) => {
        if (err) {
            res.json(err)
        }
        Activity.create({ firebaseUID: doc.firebaseUID })
        if(doc.userType===false){
            Student.create({firebaseUID:doc.firebaseUID},(er,profile)=>{
                if(er)return res.json({message:"Failed",er})
                else{
                    let data = {
                        doc,
                        profile
                    }
                    return res.json({
                        message: "Success",
                        user: data
                    })
                }
            })
        }
        else if(doc.userType===true){
            Teacher.create({firebaseUID:doc.firebaseUID},(er,profile)=>{
                if(er)return res.json({message:"Failed",er})
                else{
                    let data = {
                        doc,
                        profile
                    }
                    return res.json({
                        message: "Success",
                        user: data
                    })
                }
            })
        }
    })
})
app.get('/api/getUserData:firebaseUID',(req,res)=>{ //tested
    User.findOne({ firebaseUID: req.params.firebaseUID },(err,doc)=>{
        if(err){
            res.json({
                message:"Failed",
                err
            })
        }
        else{
            res.json({
                message:"Success",
                doc
            })
        }
    })
})

app.put('/api/addTeacherDetails',(req,res)=>{
    let data =req.body
    if(data.firebaseUID!==undefined){
        Teacher.findOneAndUpdate({firebaseUID:data.firebaseUID},data,{new:true},(er,doc)=>{
            if(er)return res.json({message:"Failed",er})
            else{
                return res.json({
                    message:"Success",
                    doc
                })
            }
        })
    }
})
app.get('/api/allTutors:page',(req,res)=>{ //tested
    var perPage = 20
    var page = req.params.page || 1
    User.find({
        userType:true
    }).skip((perPage * page) - perPage).limit(perPage).exec((error, data) => {
        if(error)res.json(handleErr(error))
        let profiles = data.map(user=>{
            let obj = {
            }
            obj.user = user
            Teacher.findOne({firebaseUID:user.firebaseUID},(er,doc)=>{
                if(er)return res.json(handleErr(er))
                else{
                    obj.teacher = doc
                    return obj
                }
            })
        })
        res.json({
            profiles,
            current: page,
            pages: Math.ceil(data.length / perPage)
        })
    })
})
app.get('/api/allStudents:page',(req,res)=>{ //tested
    var perPage = 20
    var page = req.params.page || 1
    User.find({
        userType:false
    }).skip((perPage * page) - perPage).limit(perPage).exec((error, data) => {
        if(error)res.json(handleErr(error))
        let profiles = data.map(user=>{
            let obj = {
            }
            obj.user = user
            Student.findOne({firebaseUID:user.firebaseUID},(er,doc)=>{
                if(er)return res.json(handleErr(er))
                else{
                    obj.student = doc
                    return obj
                }
            })
        })
        res.json({
            profiles,
            current: page,
            pages: Math.ceil(data.length / perPage)
        })
    })
})
app.post('/api/addExam',(req,res)=>{
    if(req.body){
        let exam = req.body
        Exam.create(exam,(err,doc)=>{
            if(err)res.json(handleErr(err))
            else res.json(handleSuccess(doc))
        })
    }
})
app.post('/api/addSubject',(req,res)=>{
    if(req.body){
        let exam = req.body
        Exam.findByIdAndUpdate(exam._id,{subjects:{$push:exam.subject}},{new:true},(err,doc)=>{
            if(err)return res.json(handleErr(err))
            else{
                res.json(handleSuccess(doc))
            }
        })
    }
})
app.put('/api/addStudentDetails',(req,res)=>{
    let data =req.body
    if(data.firebaseUID!==undefined){
        Student.findOneAndUpdate({firebaseUID:data.firebaseUID},data,{new:true},(er,doc)=>{
            if(er)return res.json({message:"Failed",er})
            else{
                return res.json({
                    message:"Success",
                    doc
                })
            }
        })
    }
})
app.put('/api/login', (req, res) => {
    const firebaseUID = req.body
    User.findOneAndUpdate(firebaseUID, { $set: { isLoggedIn: true } }, { new: true }, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: 'Success',
            user: doc
        })
    })
})

app.put('/api/logout', (req, res) => {
    const {firebaseUID} = req.body
    User.findOneAndUpdate({firebaseUID}, { isLoggedIn: false }, { new: true }, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: 'Success',
            user: doc
        })
    })
})

app.put('/api/updateUser',(req,res)=>{ 
    User.findOneAndUpdate({firebaseUID},req.body,{new:true},(err,doc)=>{
        if(err){
            res.json(handleErr(err))
        }
        else{
            res.json(handleSuccess(doc))
        }
    })
})

app.put('/api/addProfilePic',(req,res)=>{
    User.findOneAndUpdate({firebaseUID},{profilePic:req.body.profilePic},{new:true},
        (err,doc)=>{
        if(err)res.json(handleErr(err))
        else res.json(handleSuccess(doc))
    })
})

app.get('/api/searchUsers:name',(req,res)=>{
    if(req.params.name){
            User.find({ $text: { $search: req.params.name } })
                .limit(30)
                .exec((err, docs) => {
                    if (err) throw err
                    res.json(docs)
                });
    }
})
app.post('/api/addRegion',(req,res)=>{
    if(req.body){
        let reqion = req.body
        Region.create(reqion,(err,doc)=>{
            if(err)res.json(handleErr(err))
            else res.json(handleSuccess(doc))
        })
    }
})

//Server
app.listen(port,  ()=>{
    console.log('Listening on port' + port)
})