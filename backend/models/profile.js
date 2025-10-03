const mongoose = require('mongoose');
const {Schema} = mongoose;

export const profile = new Schema({
    id:{type: Number, required:false},
    username:{type:String, required:false},
    firstname:{type:String, required:false},
    lastname:{type:String, required:false},
    phone:{type:Number, required:false},
    email:{type:String, required:true}, // take value from users details in DB
    address:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String, required:true},
})

mongoose.model('profile', profile);