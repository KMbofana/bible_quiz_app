import {defineStore} from 'pinia'

export const useQuizTimer = defineStore('quiztimer',{
    state: ()=>({
        quizStarted:false,
        quizFinished:false,
    }),
    getters:{
        isQuizStarted:(state) => state.quizStarted,
        isQuizEnded:(state) => state.quizFinished
    },
    actions :{
        piniaStartQuiz(){
            this.quizStarted = true;
            this.quizFinished = false;
        },
        piniaEndQuiz(){
            this.quizFinished = true;
            this.quizStarted = false;
        }
    }
})