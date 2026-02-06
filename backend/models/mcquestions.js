const mongoose = require('mongoose');
const {Schema} = mongoose;

const mcquestionSchema = new Schema({
    question:{type:String, required:true},
    answer:{type:String, required:false},
    options:{type:[String], required:true},
    reference:{type:String, required:true},
    correctAnswer:{type:String, required:true},
    type:{type:String, required:false}
})

const mcQuestionSetSchema = new Schema({
    quizLevel:{type:String, required:true},
    levelName:{type:String, required:false},
    questions:[mcquestionSchema],
    year:{type:mongoose.Schema.Types.Date, default:new Date().getFullYear()}
},
{
    timestamps:true
}
)


const MultipleChoiceQuestionSet = mongoose.model('MCQuestionSet', mcQuestionSetSchema)

module.exports = MultipleChoiceQuestionSet