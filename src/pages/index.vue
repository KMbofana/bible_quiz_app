<template>
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
        📖 Bible Quiz
      </v-card-title>
      <v-card-text>
        Test your knowledge of the Bible with {{ sampleQuestions.length }}
        multiple choice questions.
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click="startQuiz"
          color="primary"
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
      :totalQuestions="sampleQuestions.length"
      :answers="answers"
      :questions="sampleQuestions"
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
        :totalQuestions="sampleQuestions.length"
        :selectedAnswer="selectedAnswer"
        :showResult="showResult"
        @answer="handleAnswer"
      />

      <div class="text-center mt-6" v-if="showResult">
        <v-btn
          @click="handleNext"
          color="primary"
          variant="flat"
          size="large"
        >
          {{ isLastQuestion ? "See Results" : "Next Question" }}
        </v-btn>
      </div>
    </v-col>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import QuizQuestion from '../components/QuizQuestion.vue'
import QuizResults from '../components/QuizResults.vue'

const sampleQuestions = [
  { id: 1, question: "Who was the first man created by God?", options: ["Abraham", "Moses", "Adam", "Noah"], correctAnswer: 2, verse: "Genesis 2:7" },
  { id: 2, question: "How many days did God take to create the world?", options: ["5 days", "6 days", "7 days", "8 days"], correctAnswer: 1, verse: "Genesis 1:31-2:2" },
  { id: 3, question: "What was the name of the garden where Adam and Eve lived?", options: ["Garden of Gethsemane", "Garden of Eden", "Garden of Olives", "Garden of Paradise"], correctAnswer: 1, verse: "Genesis 2:8" },
  { id: 4, question: "Who built the ark to survive the great flood?", options: ["Moses", "Abraham", "Noah", "David"], correctAnswer: 2, verse: "Genesis 6:14" },
  { id: 5, question: "Which city's walls fell down after the Israelites marched around them?", options: ["Jerusalem", "Babylon", "Jericho", "Damascus"], correctAnswer: 2, verse: "Joshua 6:20" },
  { id: 6, question: "Who was known as the strongest man in the Bible?", options: ["David", "Goliath", "Samson", "Solomon"], correctAnswer: 2, verse: "Judges 16:17" },
  { id: 7, question: "What did Jesus turn water into at the wedding in Cana?", options: ["Bread", "Wine", "Oil", "Honey"], correctAnswer: 1, verse: "John 2:9" },
  { id: 8, question: "How many apostles did Jesus choose?", options: ["10", "11", "12", "13"], correctAnswer: 2, verse: "Mark 3:14" },
  { id: 9, question: "Who betrayed Jesus for 30 pieces of silver?", options: ["Peter", "John", "Judas Iscariot", "Thomas"], correctAnswer: 2, verse: "Matthew 26:15" },
  { id: 10, question: "In which city was Jesus born?", options: ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"], correctAnswer: 2, verse: "Luke 2:4-6" }
]

const currentQuestionIndex = ref(0)
const answers = ref(new Array(sampleQuestions.length).fill(null))
const selectedAnswer = ref(null)
const showResult = ref(false)
const quizCompleted = ref(false)
const quizStarted = ref(false)

const currentQuestion = computed(() => sampleQuestions[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === sampleQuestions.length - 1)

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
  answers.value = new Array(sampleQuestions.length).fill(null)
  selectedAnswer.value = null
  showResult.value = false
  quizCompleted.value = false
  quizStarted.value = false
}

const calculateScore = () => {
  return answers.value.reduce((score, answer, index) => {
    return answer === sampleQuestions[index].correctAnswer ? score + 1 : score
  }, 0)
}
</script>
