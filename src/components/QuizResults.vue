<template>
  <div class="mx-auto" style="max-width: 800px;">
    <!-- Quiz Complete Card -->
    <v-card class="mb-6" elevation="2">
      <v-card-text class="text-center">
        <h3 class="text-h5 mb-4">Quiz Complete!</h3>

        <div class="my-4">
          <div class="text-h2 font-weight-bold text-primary">
            {{ score }}/{{ totalQuestions }}
          </div>
          <v-chip
            :color="getScoreColor()"
            text-color="white"
            class="ma-2"
            size="large"
          >
            {{ percentage }}%
          </v-chip>
          <div class="text-subtitle-1">{{ getScoreMessage() }}</div>
        </div>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn
          color="rgb(154, 63, 63)"
          variant="flat"
          @click="$emit('restart')"
          size="large"
        >
          Take Quiz Again
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Review Answers -->
    <v-card elevation="2">
      <v-card-title class="text-h6">
        Review Your Answers
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row v-for="(question, index) in questions" :key="question.id" class="mb-4">
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center mb-2">
                    <div class="text-subtitle-2">Question {{ index + 1 }}</div>
                    <v-chip
                      :color="isCorrect(index) ? 'primary' : 'error'"
                      text-color="white"
                      size="small"
                    >
                      {{ isCorrect(index) ? "Correct" : "Incorrect" }}
                    </v-chip>
                  </div>

                  <div class="mb-3">{{ question.question }}</div>

                  <div class="text-body-2 mb-1">
                    <strong>Your answer:</strong>
                    <span :class="isCorrect(index) ? 'text-success' : 'text-error'">
                      {{ getUserAnswerText(index) }}
                    </span>
                  </div>

                  <div
                    class="text-body-2 mb-1"
                    v-if="!isCorrect(index)"
                  >
                    <strong>Correct answer:</strong>
                    <span class="text-success">
                      {{ question.options[question.correctAnswer] }}
                    </span>
                  </div>

                  <div
                    v-if="question.verse"
                    class="text-caption font-italic text-medium-emphasis"
                  >
                    Reference: {{ question.verse }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: { type: Array, required: true },
  questions: { type: Array, required: true },
});

const emit = defineEmits(["restart"]);

const percentage = computed(() =>
  Math.round((props.score / props.totalQuestions) * 100)
);

const getScoreMessage = () => {
  if (percentage.value >= 90) return "Excellent Bible knowledge! 🙏";
  if (percentage.value >= 80) return "Great job! Keep studying the Word! 📖";
  if (percentage.value >= 70) return "Good work! Continue growing in faith! ✝️";
  if (percentage.value >= 60) return "Not bad! Keep reading and learning! 📚";
  return "Keep studying God's Word! Every step counts! 💪";
};

const getScoreColor = () => {
  if (percentage.value >= 80) return "green";
  if (percentage.value >= 60) return "yellow";
  return "red";
};

const isCorrect = (index) => {
  const userAnswer = props.answers[index];
  return userAnswer === props.questions[index].correctAnswer;
};

const getUserAnswerText = (index) => {
  const userAnswer = props.answers[index];
  return userAnswer !== null
    ? props.questions[index].options[userAnswer]
    : "No answer";
};
</script>
