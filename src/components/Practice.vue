<template>
    <StudentNavigation/>
    <v-container>
        <v-row>
            <v-card cols="12" class="mx-auto pa-4" max-width="800">
                <v-card-title>Practice Bible And SOP Questions Questions </v-card-title>
                <v-form @submit.prevent="getQuestions">
                    <v-responsive>
                        <v-select
                            v-model="selected"
                            :items="['Genesis', 'Exodus', 'Leviticus', 'Numbers','Deutronomy','Joshua','Ruth',
                            'Judges','1 Samuel', '2 Samuel',   '1 Kings','2 Kings','1 Chronicles',
                            '2 Chronicles','Ezra','Nehemia','Esther','Jobs','Psamls', 'Proverbs',
                            'Ecclesiastes','Songs of Solomon','Isiah','Jeremiah','Lamentations','Ezekiel',
                            'Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Zephania','Haggai',
                            'Zechariah','Malachi','Mathew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians',
                            'Galatians','Ephesians','Philippians','Colosians','1 Thessalonians','2 Thesalonians','1 Timothy','2 Timothy',
                            'Titus','Philomon','Hebrewa','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelations' 
                            ]"
                            :list-props="{ bgColor: 'rgb(154, 63, 63)' }"
                            item-color="gray"
                            label="Select Book(s)"
                            multiple
                        ></v-select>
                    </v-responsive>
                    <v-responsive>
                        <v-btn variant="flat" type="submit" :loading="isGettingQuestions" color="rgb(154, 63, 63)" block="">
                            Get Questions
                        </v-btn>
                    </v-responsive>
                </v-form>
            </v-card>
        </v-row>
        < <!-- Results Screen -->
  <v-container
    v-if="quizCompleted"
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
    v-else-if ="data.length > 0"
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

<script setup>
import { ref } from 'vue'
import {prod} from "../../api"
import axios from "axios"

import {useQuizTimer} from '../stores/quiztimer'


  const selected = ref(['Genesis'])
  const data = ref([])

  const quiztimer = useQuizTimer()
  const isGettingQuestions = ref(false)
  const quizGenerated = ref(false)

  const getQuestions = async () =>{
      isGettingQuestions.value = true
      const reqData = {
          bookName:selected.value.join()
        }
   await axios.post(`${prod}questions/student_practice_ai_mc_questions`,reqData)
   .then((result) => {
    console.log(result.data)
    console.log(result.data.questionSet.questions)
    data.value = result.data.questionSet.questions
    isGettingQuestions.value = false
   }).catch((err) => {
    isGettingQuestions.value = false
   });
  }



// populate questions and results

const currentQuestionIndex = ref(0)
const answers = ref(new Array(data.value.length).fill(null))
const selectedAnswer = ref(null)
const showResult = ref(false)
const quizCompleted = ref(false)
const quizStarted = ref(false)

const currentQuestion = computed(() => data.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === data.value.length - 1)


const handleAnswer = (answerIndex) => {
  selectedAnswer.value = answerIndex
  const newAnswers = [...answers.value]
  newAnswers[currentQuestionIndex.value] = answerIndex
  answers.value = newAnswers
  showResult.value = true
  console.log("from handle Answer", answerIndex)
  
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