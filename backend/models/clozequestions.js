const mongoose = require('mongoose');
const {Schema} = mongoose;

const clozequestionSchema = new Schema({
    question:{type:String, required:true},
    answer:{type:String, required:false},
    reference:{type:String, required:true},
    correctAnswer:{type:String, required:true},
    type:{type:String, required:false}
})

const ClozeQuestionSetSchema = new Schema({
    quizLevel:{type:String, required:true},
    levelName:{type:String, required:false},
    questions:[clozequestionSchema],
    year:{type:mongoose.Schema.Types.Date, default:new Date().getFullYear()}
},
{
    timestamps:true
}
)

const ClozeQuestionSet = mongoose.model('ClozeQuestionSet', ClozeQuestionSetSchema)

module.exports = ClozeQuestionSet