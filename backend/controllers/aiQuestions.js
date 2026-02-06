const aimcquestions = require('../models/aimcquestions')
const aiclozequestions = require('../models/aiclozequestions')
const clozequestions = require('../models/clozequestions');
const mcquestions = require('../models/mcquestions');

// console.log('api key', process.env.OPENAI_API_KEY )
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//return a json that is storable in the DB
const MCQuestionSetSchemaJSON = {
  name: "MCQuestionSet",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      quizLevel: { type: "string" },
      levelName: { type: "string" },
      questions: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            question: { type: "string" },
            answer: { type: "string" },
            reference: { type: "string" },
            options: {
              type: "array",
              items: { type: "string" },
              minItems: 2,
            },
            correctAnswer: { 
              type: "number",
              minimum: 0,
              description: "Index of the correct option in the 'options' array",
             },
            type: { type: "string", enum: ["multiple-choice", "mcq"] },
          },
          // ✅ every key in properties must be listed here
          required: [
            "question",
            "answer",
            "reference",
            "options",
            "correctAnswer",
            "type",
          ],
        },
      },
    },
    required: ["quizLevel", "questions", "levelName"], // also must list all root-level properties
  },
  strict: true,
};


const compareDates = (quizDate) =>{
  try {
    const DateToday = new Date();
    if(DateToday > quizDate){
      return true;
    }
  } catch (error) {
    return false
  }
}

//generate the questions
const generateMCQuestions = async (level, levelName, bookName, numberOfQuestions, instruction) => {
   try {
     
    const response = await openai.chat.completions.create({
    model: "gpt-4.1", // or "gpt-4o-mini", "gpt-4.1-mini"
    messages: [
      {
        role: "system",
        content: `You are a quiz generator that produces Multiple Choice question sets of ${numberOfQuestions} from the book(s) of ${bookName} in the bible in JSON format using this instruction ${instruction}. Each question must have at least 4 options to choose answers from.`,
      },
      {
        role: "user",
        content: `Generate a Multiple choice question set of of ${{numberOfQuestions}} from the book(s) of ${bookName} using this instruction ${instruction}.`,
      },
    ],
      response_format: {
      type: "json_schema",
      json_schema: MCQuestionSetSchemaJSON, // 👈 structured JSON schema
    },
  });

  const result = JSON.parse(response.choices[0].message.content);
  
  return result;
   } catch (error) {
    console.log(error)

   }
}




const saveMCQuestionsToMongo = async (req, res) => {

try {
  const {level, levelName, bookName, numberOfQuestions, instruction, regenerate} = req.body

const currentYear = new Date().getFullYear();

const humanMCQuestions = await mcquestions.findOne({
      quizLevel:level,
      levelName:levelName,
      year: currentYear
})

if(humanMCQuestions){
  return res.status(409).json({message:"Human Multiple Choice Questions Already Set"})
}

if(regenerate) {
  await aimcquestions.deleteOne({
    quizLevel:level, 
    levelName, 
    year: currentYear});
 }

const quizExist = await aimcquestions.findOne({
      quizLevel: level,
      levelName,
      year: currentYear
})

console.log(!quizExist);
  if(quizExist) return res.status(409).json({message:"quiz for this level is already set for this year!!"});
  const questionSet = await generateMCQuestions(level, levelName, bookName, numberOfQuestions, instruction);
  await aimcquestions.create({
    quizLevel:level,
    levelName,
    questions:questionSet.questions
  });
  console.log("Saved:", saved);
 
   return res.status(200).json({questions: questionSet.questions})

  } catch (error) {
  return res.status(500).json({error:"error"})
}
  
}

//cloze questions logic
const ClozeQuestionSetSchemaJSON = {
  name: "ClozeQuestionSet",
  schema:{
    type: "object",
    additionalProperties: false,
    properties: {
      quizLevel: { type: "string" },
      levelName: { type: "string" },
      questions: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            question: { type: "string" },
            answer: { type: "string" },
            reference: { type: "string" },
            correctAnswer: { type: "string" },
            type: { type: "string" },
          },
           required: [
            "question",
            "answer",
            "reference",
            "correctAnswer",
            "type",
          ],
      },
    },
  },
  required: ["quizLevel", "questions", "levelName"],
  },
   strict: true,
};

const generateClozeQuestionSet = async (level, levelName, bookName, numberOfQuestions, instruction) => {
    try {
      
    const response = await openai.chat.completions.create({
    model: "gpt-4.1", // or "gpt-4o-mini", "gpt-4.1-mini"
    messages: [
      {
        role: "system",
        content: `You are a quiz generator that produces AI Cloze question sets of ${numberOfQuestions} in JSON format from the book(s) of ${bookName} in the bible using this instruction ${instruction}.`,
      },
      {
        role: "user",
        content: `Generate a Cloze question set of ${{numberOfQuestions}} from the book(s) of ${bookName} using this instruction ${instruction}.`,
      },
    ],
    response_format: { type: "json_schema", json_schema: ClozeQuestionSetSchemaJSON },
  });

  const result = JSON.parse(response.choices[0].message.content);
 
  return result;
} catch (error) {
      console.log(error)
    }
}

const saveClozeQuestionsToMongo = async (req, res) => {
  try {
    const {
      level,
      levelName,
      bookName,
      numberOfQuestions,
      instruction,
      regenerate
    } = req.body;

    const checkAiQuestions = await aimcquestions.findOne({
       quizLevel:level,
       levelName:levelName,
       year: currentYear
    })

    if(checkAiQuestions){
      return res.status(409).json({message:"AI generated questions already generated!"})
    }

    const manualQuestionSet = await clozequestions.findOne({
       quizLevel:level,
       levelName:levelName,
       year: currentYear
    })

    if(manualQuestionSet){
      return res.status(409).json({message:"Human Generated Questions Were Already Set!!"})
    }

    const currentYear = new Date().getFullYear();

    if (regenerate) {
      await aiclozequestions.deleteOne({
        quizLevel: level,
        levelName,
        year: currentYear
      });
    }

    const quizExist = await aiclozequestions.findOne({
      quizLevel: level,
      levelName,
      year: currentYear
    });

    if (quizExist) {
      return res.status(409).json({
        message: "Quiz for this level already exists this year"
      });
    }

    const questionSet = await generateClozeQuestionSet(
      level,
      levelName,
      bookName,
      numberOfQuestions,
      instruction
    );

    await aiclozequestions.create({
      quizLevel: level,
      levelName,
      questions: questionSet.questions,
      year: currentYear
    });

    return res.status(200).json({ questions: questionSet.questions });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const serveMCQuestionsToStudents = async(req,res) =>{
const {level, levelName, bookName, numberOfQuestions} = req.body
  const questionSet = await generateMCQuestions(level, levelName, bookName, numberOfQuestions);
  console.log("Saved:", questionSet);
   if(questionSet){
    res.status(200).json({questionSet})
  }else{
  res.status(500).json({error:"error"})
  }
}
const serveClozeQuestionsToStudents = async (req,res) =>{
  const {level, levelName, bookName, numberOfQuestions} = req.body
  const questionSet = await generateClozeQuestionSet(level, levelName, bookName, numberOfQuestions);
  console.log("Saved:", saved);
   if(questionSet){
    res.status(200).json({questionSet})
  }else{
  res.status(500).json({error:"error"})
  }
}



module.exports = {
    serveMCQuestionsToStudents,
    serveClozeQuestionsToStudents,
    saveMCQuestionsToMongo,
    saveClozeQuestionsToMongo,
    compareDates
}