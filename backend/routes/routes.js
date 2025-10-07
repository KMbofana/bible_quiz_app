const express = require('express')
const router = express.Router()

const usersController = require('../controllers/usersController')
const questionsController = require('../controllers/questions')
const orgStructureController = require('../controllers/orgStructureController')

router.get('/', (req, res)=>{
    console.log('app backend')
    return res.send("app backend 😎🧑‍💻🖥️")
})

router.post('/api/user_registration', usersController.createUser)
router.post('/api/login', usersController.userLogin)


router.post('/api/human_create_cloze_questions', questionsController.saveClozeQuestions)
router.post('/api/human_create_mc_questions', questionsController.saveMCQuestions)

// add organization units
router.post('/api/orgunits/add_each_unit',orgStructureController.addUnits)

//get whole organiztion structure
router.get('/api/orgunits/get_each_unit',orgStructureController.getEachUnit)

//get branch by ID
//GET http://localhost:3001/api/orgunits/670f999999abcde7890f4444/branch
router.get('/api/orgunits/branch/:id',orgStructureController.getbranchByID )


// student view questions
router.get('/api/questions/student_view_cloze_questions', questionsController.studentViewClozeQuestions)
router.get('/api/questions/student_view_mc_questions', questionsController.studentViewMCQuestions)

module.exports = router