const clozequestions = require('../models/clozequestions');
const mcquestions = require('../models/mcquestions');

const saveClozeQuestions = async (req, res) => {    
   
   const {quizLevel,levelName, questions} = req.body;
    console.log(JSON.parse(questions))
   await clozequestions.create({
    quizLevel,
    levelName,
    questions:JSON.parse(questions)
   })
   .then((result) => {
    res.status(201).json({message:'cloze questions created successfully🎉'})
   }).catch((err) => {
    res.status(500).json({message:'failed to save questions 😔, please try again', err})
   });
}



const saveMCQuestions = async (req, res) => {
    
   const {quizLevel,levelName, questions} = req.body;

   await mcquestions.create({
    quizLevel,
    levelName,
    questions:JSON.parse(questions)
   })
   .then((result) => {
    res.status(201).json({message:'multiple choice questions save successfully🎉'})
   }).catch((err) => {
    res.status(500).json({message:'failed to save questions 😔, please try again',err})
   });
}

const studentViewClozeQuestions = async (req, res) => {
    const quizLevel = "District";
    const levelName= "Maramba"
    const response = await clozequestions.find({quizLevel, levelName})
    if(!response){
        res.status(404).json({message:`${quizLevel} does not have set questions`})
    }else{
        res.status(200).json({message:"success", questions:response})
    }
}
const studentViewMCQuestions = async(req, res) =>{
    const quizLevel = req.query.quizLevel;
    const levelName= req.query.levelName
    
    const response = await mcquestions.find({quizLevel, levelName})
    if(!response){
        res.status(404).json({message:`${quizLevel} does not have set questions`})
    }else{
        res.status(200).json({message:"success", questions:response})
    }
}


module.exports = {
    saveClozeQuestions,
    saveMCQuestions,
    studentViewClozeQuestions,
    studentViewMCQuestions
}