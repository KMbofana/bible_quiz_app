const clozequestions = require('../models/clozequestions');
const mcquestions = require('../models/mcquestions');
const userResults = require('../models/userResults');
const aimcquestions = require('../models/aimcquestions')
const aiclozequestions = require('../models/aiclozequestions')

const saveClozeQuestions = async (req, res) => {    
   try {
        
   const {quizLevel,levelName, questions} = req.body;

   const currentYear = new Date().getFullYear();

   const AiClozeQuestions = await aiclozequestions.findOne({
         quizLevel:quizLevel,
         levelName:levelName,
         year: currentYear
   })
   
   if(AiClozeQuestions){
     return res.status(409).json({message:"Ai Cloze Questions Already Set"})
   }

   const quizExist = await clozequestions.exists({quizLevel, levelName,year: currentYear});
   if(quizExist){
    return res.status(403).json({message:"quiz already set for this level"})
   }
    console.log(questions)
   await clozequestions.create({
    quizLevel,
    levelName,
    questions:questions,
    year: currentYear
   })
   return res.status(201).json({message:'cloze questions created successfully🎉'})
 
   } catch (error) {
    console.log(error)
        return res.status(500).json({ error: "Internal server error" });
   }
}



const saveMCQuestions = async (req, res) => {
    
  try {
     const {quizLevel,levelName, questions} = req.body;

   const currentYear = new Date().getFullYear();

    const AiMCQuestions = await aimcquestions.findOne({
         quizLevel:quizLevel,
         levelName:levelName,
         year: currentYear
   })
   
   if(AiMCQuestions){
     return res.status(409).json({message:"Ai Multiple Choice Questions Already Set"})
   }

   const results = await mcquestions.findOne({quizLevel, levelName, year: currentYear});

   if(!results){
         await mcquestions.create({
        quizLevel,
        levelName,
        questions
    })
    
        return res.status(201).json({message:'multiple choice questions save successfully🎉'})
   
   }else{
       return res.status(201).json({status:403,message:'⚠️ only one set of questions allowed per level'})
   }
  } catch (error) {
    return res.status(500).json({error:"error"})
  }
   
}

const studentViewClozeQuestions = async (req, res) => {
    try {
        console.log("*** endpoint reached")
        // const quizLevel = req.query.quizLevel;
        // const levelName= req.query.levelName
        const {quizLevel, levelName, year} = req.query;
        
        const humanMCquestions = await clozequestions.findOne({quizLevel, levelName, year})
        const aiMCquestions = await aimcquestions.findOne({quizLevel, levelName, year})

        console.log(aiMCquestions, humanMCquestions, year)

        if(!humanMCquestions){
            res.status(200).json({message:"success", questions:aiMCquestions})
        }else if(!aiMCquestions){
            res.status(200).json({message:"success", questions:humanMCquestions})
        }else{
            res.status(404).json({message:`${quizLevel} does not have set questions`})
        }

    }catch(error) {
        console.log(error)
        return res.status(500).json({message:"internal server error"})
    }
}
const studentViewMCQuestions = async(req, res) =>{
  try {
    const quizLevel = req.query.quizLevel;
    const levelName = req.query.levelName
    const year = req.query.year;

    const humanMCquestions = await mcquestions.findOne({quizLevel, levelName, year:Number(year)})
    const aiMCquestions = await aimcquestions.find({quizLevel, levelName, year:Number(year)})

    console.log(aiMCquestions, humanMCquestions);
    console.log(quizLevel, levelName, year);
    
    if(!humanMCquestions){
       return res.status(200).json({message:"success", questions:aiMCquestions})
    }else if(!aiMCquestions){
       return res.status(200).json({message:"success", questions:humanMCquestions})
    }else{
        return res.status(404).json({message:`${quizLevel} does not have set questions`})
    }
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"internal server error"})
  }
   
}

const saveUserMCResults = async (req, res) =>{
    try {
        const {user,questionsID, userResponse, score, totalQuestions} = req.body

    const result = await userResults.findOne({questionsID});
        console.log(!result)
    if(!result){
        
        userResults.create({
            user, 
            questionsID,
            questions:userResponse, 
            score, 
            totalQuestions
        })
        .then((result) => {
            res.status(201).json({message:"user response save successfully"})
            
        }).catch((err) => {
            console.log(err)
             res.status(500).json({message:"failed to save user responses"})
        });   
    }else{
        console.log(user,questionsID, score, totalQuestions)
        userResults.updateOne({ 
            questionsID: questionsID },  
            { $set: { questions: userResponse, score } })
            .then((result) => {
                res.status(201).json({message:'update was successful'})
            }).catch((err) => {
                console.log(err)
            });
    }
    } catch (error) {
       console.log(error) 
       res.status(500).json({error})
    }
    
}



module.exports = {
    saveClozeQuestions,
    saveMCQuestions,
    studentViewClozeQuestions,
    studentViewMCQuestions,
    saveUserMCResults
}