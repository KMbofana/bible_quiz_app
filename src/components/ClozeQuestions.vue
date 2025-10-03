<template>
  <v-container class="py-6" max-width="800">
    <v-card elevation="2" rounded="lg" class="mx-auto">
      <v-card-text>
        <!-- Question Progress -->
        <v-row class="align-center mb-4">
          <v-col cols="auto">
            <span class="text-caption text-grey">
              Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
            </span>
          </v-col>
          <v-col>
            <v-progress-linear
              :model-value="((currentQuestionIndex + 1) / questions.length) * 100"
              color="primary"
              height="8"
              rounded
            ></v-progress-linear>
          </v-col>
        </v-row>

        <!-- Question Text -->
        <h3 class="text-h6 mb-2">{{ currentQuestion.question }}</h3>
        <p v-if="currentQuestion.verse" class="text-caption font-italic text-grey">
          Reference: {{ currentQuestion.verse }}
        </p>

        <!-- Input Field for Cloze Answer -->
        <v-text-field
          v-model="userAnswer"
          :label="'Fill in the blank'"
          outlined
          dense
          class="mt-4"
          :disabled="showResult"
          @keyup.enter="submitAnswer"
        ></v-text-field>

        <!-- Feedback -->
        <v-alert
          v-if="showResult"
          :type="isCorrect ? 'success' : 'error'"
          class="mt-4"
          dense
          border="left"
        >
          {{ isCorrect ? '✅ Correct!' : `❌ Incorrect! Correct answer: ${currentQuestion.answer}` }}
        </v-alert>

        <!-- Next / See Results Button -->
        <v-row class="mt-4">
          <v-col cols="12" class="text-center">
            <v-btn
              color="rgb(154, 63, 63)"
              @click="handleNext"
              :disabled="!showResult"
            >
              {{ isLastQuestion ? 'See Results' : 'Next Question' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Quiz Results -->
    <v-card
      v-if="quizCompleted"
      elevation="3"
      rounded="lg"
      class="mx-auto mt-6"
    >
      <v-card-text class="text-center">
        <h3 class="text-h5 mb-4">Quiz Completed! 🎉</h3>
        <div class="text-h2 font-weight-bold text-primary">
          {{ score }}/{{ questions.length }}
        </div>
        <v-chip color="primary" text-color="white" class="ma-2" size="large">
          {{ Math.round((score / questions.length) * 100) }}%
        </v-chip>
        <div class="text-subtitle-1">{{ getScoreMessage() }}</div>

        <v-btn
          color="rgb(154, 63, 63)"
          variant="flat"
          size="large"
          class="mt-4"
          @click="restartQuiz"
        >
          Take Quiz Again
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed,onMounted } from 'vue'
import { useQuizStore } from '@/stores/quizLevel'
import axios from 'axios'

const quizStore = useQuizStore()
const questions = ref([])


onMounted(async () => {

  try {
    const result = await axios.get('http://localhost:3001/api/questions/student_view_cloze_questions', {
      params: {
        quizLevel: quizStore.quizLevel,
        levelName: quizStore.name,
      },
    })
    questions.value = result.data.questions[0].questions
    console.log('Data loaded:', result.data.questions[0].questions[0])
  } catch (error) {
    console.error('Failed to load:', error)
  }
})

// const questions = [
//   { id: 1, text: 'For God so loved the world that He gave His only _____ Son.', answer: 'begotten', verse: 'John 3:16' },
//   { id: 2, text: 'Jesus turned water into _____ at the wedding in Cana.', answer: 'wine', verse: 'John 2:9' },
//   { id: 3, text: 'The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, _____, self-control.', answer: 'gentleness', verse: 'Galatians 5:22-23' }
// ]

const currentQuestionIndex = ref(0)
const userAnswer = ref('')
const answers = ref([])
const showResult = ref(false)
const quizCompleted = ref(false)
const score = ref(0)

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {})
// const currentQuestion = { id: 1, text: 'For God so loved the world that He gave His only _____ Son.', answer: 'begotten', verse: 'John 3:16' }
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)
const isCorrect = computed(() => userAnswer.value.trim().toLowerCase() === currentQuestion.value.answer.toLowerCase())
const percentage = computed(() => Math.round((score.value / questions.value.length) * 100))

const submitAnswer = () => {
  if (!showResult.value) {
    showResult.value = true
    answers.value[currentQuestionIndex.value] = userAnswer.value
    if (isCorrect.value) score.value++
  }
}

const handleNext = () => {
  if (!showResult.value) return
  if (isLastQuestion.value) {
    quizCompleted.value = true
  } else {
    currentQuestionIndex.value++
    userAnswer.value = ''
    showResult.value = false
  }
}

const restartQuiz = () => {
  currentQuestionIndex.value = 0
  userAnswer.value = ''
  answers.value = []
  showResult.value = false
  quizCompleted.value = false
  score.value = 0
}

const getScoreMessage = () => {
  if (percentage.value >= 90) return 'Excellent Bible knowledge! 🙏'
  if (percentage.value >= 80) return 'Great job! Keep studying the Word! 📖'
  if (percentage.value >= 70) return 'Good work! Continue growing in faith! ✝️'
  if (percentage.value >= 60) return 'Not bad! Keep reading and learning! 📚'
  return 'Keep studying God\'s Word! Every step counts! 💪'
}
</script>
