const mongoose = require("mongoose");
// import mongoose from "mongoose";
const {Schema} = mongoose;


const userSchema = new Schema({
    id:{type: Number, required:false},
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    phone:{type:Number, required:true},
    email:{type:String, required:true},
    district:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String, required:true},
})

const User = mongoose.model('user',userSchema);

module.exports = User;