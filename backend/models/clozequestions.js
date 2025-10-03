const mongoose = require('mongoose');
const {Schema} = mongoose;

const clozequestionSchema = new Schema({
    question:{type:String, required:true},
    answer:{type:String, required:true},
    reference:{type:String, required:true},
    correctAnswer:{type:Number, required:true}
})

const ClozeQuestionSetSchema = new Schema({
    quizLevel:{type:String, required:true},
    levelName:{type:String, required:false},
    questions:[clozequestionSchema]
})

const ClozeQuestionSet = mongoose.model('ClozeQuestionSet', ClozeQuestionSetSchema)

module.exports = ClozeQuestionSet