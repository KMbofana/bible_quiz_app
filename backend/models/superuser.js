const mongoose = require('mongoose')
const {Schema} = mongoose

const superUserSchema = new Schema({
    email:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String, required:true}
})

const superuser = mongoose.model('initialuser', superUserSchema)

module.exports = superuser