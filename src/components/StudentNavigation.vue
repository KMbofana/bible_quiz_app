<template>
       <v-navigation-drawer
        v-model="drawer"   
         app
        :permanent="$vuetify.display.mdAndUp"
        temporary
       >
                    <v-list>
                        <RouterLink class="redirectLink" to="/student_portal">
                            <v-list-item >
                                <v-list-item-title >Take Quiz</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                        <RouterLink class="redirectLink" to="/human_mc_questions">
                            <v-list-item >
                                <v-list-item-title>Practice</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                        <RouterLink class="redirectLink" to="/#">
                            <v-list-item >
                                <v-list-item-title>Perfomance History</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                        <RouterLink class="redirectLink" to="/#">
                            <v-list-item >
                                <v-list-item-title>Profile</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                        <RouterLink class="redirectLink" to="/">
                            <v-list-item>
                                <v-list-item-title>Logout</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                    </v-list>
                </v-navigation-drawer>

                 <v-app-bar app>
                    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
                     <v-spacer></v-spacer>
                    <v-btn v-if="isQuizStarted" color="#900D09" variant="flat">
                       Watch Your Minutes {{ formattedMinutes + ':' + formattedSeconds }}
                    </v-btn>
                </v-app-bar>
</template>



<script setup>
import { ref, onMounted, onUnmounted, watch, computed  } from 'vue';
import {useQuizTimer} from '../stores/quiztimer'

const drawer = ref(null)

const timerMinutes = ref(12)
const timerSeconds = ref(0)
let interval = null

const quizTimer = useQuizTimer()
const isQuizStarted = computed(()=>quizTimer.isQuizStarted)
console.log("is quiz started", isQuizStarted)

// Format display with leading zeros (e.g., 09:05)
const formattedMinutes = computed(() =>
  timerMinutes.value.toString().padStart(2, '0')
)
const formattedSeconds = computed(() =>
  timerSeconds.value.toString().padStart(2, '0')
)

const countDown = () => {
  interval = setInterval(() => {
    if (timerSeconds.value > 0) {
      timerSeconds.value--
    } else {
      if (timerMinutes.value > 0) {
        timerMinutes.value--
        timerSeconds.value = 59
      } else {
        quizTimer.piniaEndQuiz()
        clearInterval(interval) // stop when both reach 0
      }
    }
  }, 1000) // 1 second per tick
}

onMounted(() => {
  countDown()
})

onUnmounted(() => {
  clearInterval(interval)
})

// Watch the store’s reactive state
watch(
  () => quizTimer.isQuizStarted,
  (newVal) => {
    if (newVal) {
      // Reset timer and start countdown
      timerMinutes.value = 12
      timerSeconds.value = 0
      countDown()
    } else {
      // Stop timer when quiz stops
      clearInterval(interval)
    }
  },
  { immediate: true }
)

</script>
<style>
.redirectLink{
    text-decoration: none;
    color: black;
}

</style>