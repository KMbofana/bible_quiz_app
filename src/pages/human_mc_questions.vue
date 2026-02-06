<template>
  <StudentNavigation/>
  <v-container>
  
        <!-- Start Screen -->
  <v-container
    v-if="!quizStarted"
    class="fill-height d-flex align-center justify-center"
    fluid
  >
    <v-card
      max-width="500"
      elevation="3"
      class="mx-auto text-center"
      rounded="lg"
    >
      <v-card-title class="text-h4 justify-center">
        📖 Bible Quiz - {{ quizStore.levelName }}
      </v-card-title>
      <v-card-text>
        Test your knowledge of the Bible with {{ data.length }}
        multiple choice questions.
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click="startQuiz"
          color="rgb(154, 63, 63)"
          variant="flat"
          size="large"
          block
        >
          Start Quiz
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

  <!-- Results Screen -->
  <v-container
    v-else-if="quizCompleted"
    class="fill-height d-flex align-center justify-center"
    fluid
  >
    <QuizResults
      :score="calculateScore()"
      :totalQuestions="data.length"
      :answers="answers"
      :questions="data"
      @restart="handleRestart"
    />
  </v-container>

  <!-- Quiz Question Screen -->
  <v-container
    v-else
    class="fill-height d-flex flex-column align-center justify-center"
    fluid
  >
    <v-col cols="12" md="8" lg="6" class="mx-auto">
      <QuizQuestion
        :question="currentQuestion"
        :currentQuestion="currentQuestionIndex + 1"
        :totalQuestions="data.length"
        :selectedAnswer="selectedAnswer"
        :showResult="showResult"
        @answer="handleAnswer"
      />

      <div class="text-center mt-6" v-if="showResult">
        <v-btn
          @click="handleNext"
          color="rgb(154, 63, 63)"
          variant="flat"
          size="large"
        >
          {{ isLastQuestion ? "See Results" : "Next Question" }}
        </v-btn>
      </div>
    </v-col>
  </v-container>
  </v-container>
</template>

<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "roles": ["user"]
  }
}
</route>


<script setup>
import { ref, computed, onMounted } from 'vue'
import QuizQuestion from '../components/QuizQuestion.vue'
import QuizResults from '../components/QuizResults.vue'
import { useQuizStore } from '../stores/quizLevel'
import axios from 'axios'
import { prod } from '../../api';
import { useToast } from 'vue-toastification'
import {useQuizTimer} from '../stores/quiztimer'

import {useAuthStore} from "../stores/auth"
import { useQuestionsStore } from '../stores/questions'

const quizStore = useQuizStore()
const data = ref([])

const toast = useToast()
const authStore = useAuthStore()
const quiztimer = useQuizTimer()
const questionStore = useQuestionsStore()

onMounted(async () => {

  try {
     questionStore.resetQuestionID()
    const result = await axios.get(`${prod}questions/student_view_mc_questions`, {
      params: {
        quizLevel: quizStore.quizLevel,
        levelName: authStore.userDistrict,
        year:new Date().getFullYear()
      },
    })
    console.log(result.data)
   if(result.data.questions.length === 0){
      toast.error(`no questions in ${authStore.userDistrict} district`, {timeout:4000})
   }else{
     console.log(result)
    data.value = result.data.questions[0].questions
    questionStore.getQuestionID(result.data.questions[0]._id)
    console.log('question id:', result.data.questions[0]._id)
   }
  } catch (error) {
    console.error('Failed to load:', error)
  }
})


const currentQuestionIndex = ref(0)
const answers = ref(new Array(data.value.length).fill(null))
const selectedAnswer = ref(null)
const showResult = ref(false)
const quizCompleted = ref(false)
const quizStarted = ref(false)

const currentQuestion = computed(() => data.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === data.value.length - 1)


const startQuiz = () => { 
   if(data.value.length <= 0){
    toast.error("no quiz set for this level")
    return
  }
  quizStarted.value = true 
  quiztimer.piniaStartQuiz()
  console.log("initiating method",quiztimer.isQuizStarted)
}

const handleAnswer = (answerIndex) => {
  selectedAnswer.value = answerIndex
  const newAnswers = [...answers.value]
  newAnswers[currentQuestionIndex.value] = answerIndex
  answers.value = newAnswers
  showResult.value = true
  
}

const handleNext = () => {
  if (isLastQuestion.value) {
    quizCompleted.value = true
    quiztimer.piniaEndQuiz()
  } else {
    currentQuestionIndex.value++
    selectedAnswer.value = null
    showResult.value = false
  }
}

const handleRestart = () => {
  currentQuestionIndex.value = 0
  answers.value = new Array(data.value.length).fill(null)
  selectedAnswer.value = null
  showResult.value = false
  quizCompleted.value = false
  quizStarted.value = false
  quiztimer.piniaStartQuiz()
}

const calculateScore = () => {
  return answers.value.reduce((score, answer, index) => {
    return answer === Number(data.value[index].correctAnswer) ? score + 1 : score
  }, 0)
}

watch(()=>quiztimer.quizFinished,
(newVal)=> {
     if (newVal) {
      console.log("quiz ended due to time", newVal);
      quizCompleted.value = true; // your local ref
    }
})

</script>
