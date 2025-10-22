const mongoose = require('mongoose');
const {Schema} = mongoose;

const aiclozequestionSchema = new Schema({
    question:{type:String, required:true},
    answer:{type:String, required:false},
    reference:{type:String, required:true},
    correctAnswer:{type:String, required:true},
    type:{type:String, required:false}
})

const ClozeQuestionSetSchema = new Schema({
    quizLevel:{type:String, required:true},
    levelName:{type:String, required:false},
    questions:[aiclozequestionSchema]
})

const aiClozeQuestionSet = mongoose.model('aiClozeQuestionSet', ClozeQuestionSetSchema)

module.exports = aiClozeQuestionSet