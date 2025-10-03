const mongoose = require('mongoose');
const {Schema} = mongoose;

const mcquestionSchema = new Schema({
    question:{type:String, required:true},
    answer:{type:String, required:true},
    options:{type:[String], required:true},
    reference:{type:String, required:true},
    correctAnswer:{type:Number, required:true}
})

const mcQuestionSetSchema = new Schema({
    quizLevel:{type:String, required:true},
    levelName:{type:String, required:false},
    questions:[mcquestionSchema]
})


const MultipleChoiceQuestionSet = mongoose.model('MCQuestionSet', mcQuestionSetSchema)

module.exports = MultipleChoiceQuestionSet