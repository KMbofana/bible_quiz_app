const express = require('express')
const router = express.Router()

const usersController = require('../controllers/usersController')
const questionsController = require('../controllers/questions')

router.get('/', (req, res)=>{
    console.log('app backend')
    return res.send("app backend 😎🧑‍💻🖥️")
})

router.post('/api/user_registration', usersController.createUser)
router.post('/api/login', usersController.userLogin)


router.post('/api/human_create_cloze_questions', questionsController.saveClozeQuestions)
router.post('/api/human_create_mc_questions', questionsController.saveMCQuestions)

// student view questions
router.get('/api/questions/student_view_cloze_questions', questionsController.studentViewClozeQuestions)
router.get('/api/questions/student_view_mc_questions', questionsController.studentViewMCQuestions)

module.exports = router