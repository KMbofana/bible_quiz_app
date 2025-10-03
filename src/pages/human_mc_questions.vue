<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <StudentNavigation/>
      </v-col>
      <v-col cols="12">
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import QuizQuestion from '../components/QuizQuestion.vue'
import QuizResults from '../components/QuizResults.vue'
import { useQuizStore } from '@/stores/quizLevel'
import axios from 'axios'
import { prod, dev } from '../../api';

const quizStore = useQuizStore()
const data = ref([])

onMounted(async () => {

  try {
    const result = await axios.get(`${prod}questions/student_view_mc_questions`, {
      params: {
        quizLevel: quizStore.quizLevel,
        levelName: quizStore.name,
      },
    })
    data.value = result.data.questions[0].questions
    console.log('Data loaded:', result.data.questions[0].questions)
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

const startQuiz = () => { quizStarted.value = true }

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
}

const calculateScore = () => {
  return answers.value.reduce((score, answer, index) => {
    return answer === data.value[index].correctAnswer ? score + 1 : score
  }, 0)
}
</script>
