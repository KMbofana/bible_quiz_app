<template>
  <div class="p-4 bg-white rounded-xl shadow">
    <h2 class="text-lg font-semibold mb-2">Recently Saved Cloze Question Sets</h2>

    <div v-if="loading">Loading...</div>

    <ul v-else>
      <li
        v-for="(item, index) in questionSets"
        :key="index"
        class="border-b py-2 last:border-b-0"
      >
        <div class="font-medium">{{ item.levelName || item.quizLevel }}</div>
        <div class="text-sm text-gray-600">
          {{ item.questions.length }} questions — from {{ item.quizLevel }}
        </div>
      </li>
    </ul>

    <button
      v-if="questionSets.length"
      @click="$emit('viewAll')"
      class="mt-3 text-blue-500 hover:underline"
    >
      View all
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// const questionSets = ref([]);
const loading = ref(true);
const props = defineProps({
    questionSets:{type: Array, required:true}
})


</script>

<style scoped>
/* optional styling tweaks */
</style>
