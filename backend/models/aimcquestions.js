const mongoose = require('mongoose');
const {Schema} = mongoose;

const aimcquestionSchema = new Schema({
    question:{type:String, required:true},
    answer:{type:String, required:false},
    options:{type:[String], required:true},
    reference:{type:String, required:true},
    correctAnswer:{type:String, required:true},
    type:{type:String, required:false}
})

const aimcQuestionSetSchema = new Schema({
    quizLevel:{type:String, required:true},
    levelName:{type:String, required:false},
    questions:[aimcquestionSchema]
})


const aiMultipleChoiceQuestionSet = mongoose.model('aiMCQuestionSet', aimcQuestionSetSchema)

module.exports = aiMultipleChoiceQuestionSet