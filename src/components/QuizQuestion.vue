<template>
  <v-card rounded="lg" elevation="2" max-width="800" class="mx-auto">
    <v-card-text>
      <!-- Top Section with Progress -->
      <v-row class="align-center mb-4">
        <v-col cols="auto">
          <span class="text-caption text-grey">
            Question {{ currentQuestion }} of {{ totalQuestions }}
          </span>
        </v-col>
        <v-col>
          <v-progress-linear
            :model-value="(currentQuestion / totalQuestions) * 100"
            color="primary"
            height="8"
            rounded
            class="rounded-pill"
          ></v-progress-linear>
        </v-col>
      </v-row>

      <!-- Question -->
      <h3 class="text-h6 mb-2">
        {{ question.question }}
      </h3>

      <!-- Verse Reference -->
      <p v-if="question.verse" class="text-caption font-italic text-grey">
        Reference: {{ question.verse }}
      </p>
    </v-card-text>

    <!-- Options -->
    <v-divider></v-divider>
    <v-card-text>
      <v-row dense>
        <v-col
          v-for="(option, index) in question.options"
          :key="index"
          cols="12"
        >
          <v-btn
            block
            :color="getButtonColor(index)"
            :variant="getButtonVariant(index)"
            class="justify-start py-4 text-body-2"
            :disabled="showResult"
            @click="!showResult && $emit('answer', index)"
          >
            <span class="mr-3 font-weight-medium">
              {{ String.fromCharCode(65 + index) }}.
            </span>
            {{ option }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  question: { type: Object, required: true },
  currentQuestion: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  selectedAnswer: { type: Number, default: null },
  showResult: { type: Boolean, default: false }
})

const emit = defineEmits(['answer'])

/**
 * Returns Vuetify button color for each answer state.
 */
const getButtonColor = (index) => {
  if (props.showResult) {
    if (index === props.question.correctAnswer) return 'green'
    if (index === props.selectedAnswer && index !== props.question.correctAnswer) return 'red'
    return 'grey'
  } else if (props.selectedAnswer === index) {
    return 'secondary'
  }
  return 'grey'
}

/**
 * Returns Vuetify button variant for each answer state.
 */
const getButtonVariant = (index) => {
  if (props.showResult) {
    if (index === props.question.correctAnswer) return 'flat'
    if (index === props.selectedAnswer && index !== props.question.correctAnswer) return 'flat'
    return 'outlined'
  } else if (props.selectedAnswer === index) {
    return 'flat'
  }
  return 'outlined'
}
</script>
