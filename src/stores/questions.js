import { defineStore } from "pinia";

export const useQuestionsStore = defineStore('question_store', {
    state: () =>({
        questionIDValue:null
    }),
    getters:{
        questionID: (state) => state.questionIDValue
    },
    actions:{
        getQuestionID(id){
            this.questionIDValue = id;
        },
        resetQuestionID(){
            this.questionIDValue = null
        }
    }
}) 