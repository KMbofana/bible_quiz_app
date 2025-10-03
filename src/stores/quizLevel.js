// Utilities
import { defineStore } from 'pinia'

export const useQuizStore = defineStore('quizLevel', {
  state: () => ({
    //
    quizLevel:'',
    name:''
  }),

  actions:{
    setQuizLevel(level){
        this.quizLevel = level
    },
    setLevelName(name){
      this.name = name;
    }
  },
  getters:{
    currentLevel: (state) => state.quizLevel,
    levelName: (state) => state.name
  }
})
