const mongoose = require('mongoose');
const {Schema} = mongoose;

const aiclozequestionSchema = new Schema({
    question:{type:String, required:true},
    answer:{type:String, required:false},
    reference:{type:String, required:true},
    correctAnswer:{type:String, required:true},
    type:{type:String, required:false},
})

const ClozeQuestionSetSchema = new Schema({
    quizLevel:{type:String, required:true},
    levelName:{type:String, required:false},
    questions:[aiclozequestionSchema],
    year: {
    type: Number,
    required: true,
    default: () => new Date().getFullYear()
  }
},
 {
    timestamps:true
}
)

ClozeQuestionSetSchema.index(
  { quizLevel: 1, levelName: 1, year: 1 },
  { unique: true }
);

const aiClozeQuestionSet = mongoose.model('aiClozeQuestionSet', ClozeQuestionSetSchema)

module.exports = aiClozeQuestionSet