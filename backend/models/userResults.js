const mongoose = require('mongoose')
const {Schema} = mongoose

const userResultsSchema = new Schema({
    user:{type: String, required:true},
    questionsID:{type:mongoose.Schema.Types.ObjectId, required:false},
    questions:{type: mongoose.Schema.Types.Mixed, required:true},
    score:{type: Number, required:true},
    totalQuestions:{type: Number, required:true}

})

const userResults = mongoose.model('userresult', userResultsSchema)

module.exports = userResults