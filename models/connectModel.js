const mongoose = require('mongoose');


var connectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    comment:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:"Submitted",
        enum:["In Progress","Connected","Submitted"],
    }
});

//Export the model
module.exports = mongoose.model('Connect', connectSchema);