<template>
    <v-container>
        <v-row>
            <v-col cols="2">
                <AdminNavigation />
            </v-col>
            <v-col cols="12">
                <!--  section to create mc questions-->
                <v-card>
                    <v-card-title>Create Multiple Choice Questions</v-card-title>
                    <v-form @submit.prevent="saveQuestion" ref="formRef">
                        <div class="">
                             <v-responsive
                class=""
            >
            <v-select
                label="Quiz Level"
                :items="['District', 'Federation', 'Conference', 'Union', 'SID', 'GC']"
                v-model="quizLevel"
                class="ml-4 mr-4 pb-4"
                required
                ></v-select>
           
        </v-responsive>
         <v-responsive
                class=""
            >
            <v-text-field
                            hide-details="auto"
                            class="ml-4 mr-4 pb-4"
                            label="Name"
                            placeholder="WHYFED"
                            type="input"
                            v-model="levelName"
                            :rules="rules"
                            
                            ></v-text-field>
           
        </v-responsive>
                        <v-responsive
                            class="p-4"
                        >
                            <v-text-field
                            hide-details="auto"
                            class="ml-4 mr-4 pb-4"
                            label="Question"
                            placeholder="john"
                            type="input"
                            v-model="question"
                            :rules="rules"
                            
                            ></v-text-field>
                        </v-responsive>
                        
                        <v-responsive
                            class="p-4"
                        >
                        <v-select
                        label="Question Type"
                        :items="['mc', 'Cloze Question']"
                        class="ml-4 mr-4 pb-4"
                        v-model="type"
                        :rules="rules"
                        ></v-select>
                        </v-responsive>
                        
                        <div v-if="options.length > 0">
                            <h1 class="ml-4">Multiple Choices</h1>
                            <v-list>
                                <v-list-item
                                    v-for="(option, index) in options"
                                    :key="option.id"
                                    class="flex items-center justify-between mb-1 ml-4"
                                    
                                >
                               <div class="d-flex flex-row justify-between">
                                 <!-- Radio button -->
                                
                                <strong>{{ alphabetLabel(index) }}.</strong>
                             
                                <v-list-item-title class="ml-2">
                                {{ option }}
                                </v-list-item-title>
                                <input
                                    type="radio"
                                    class="ml-2"
                                    v-model="selectedOption"
                                    :value="option"
                                />
                                <!-- Delete button -->
                                <button @click="removeOption(index)" class="ml-2 text-red">
                                🗑️
                                </button>
                               </div>
                            </v-list-item>
                            </v-list>
                        </div>
                        <!-- add option button -->
                        <div class="flex flex-row gap-2 ml-4 pb-4" v-if="type ==='mc' && options.length < 4">
                             <v-text-field
                                    v-model="newOption"
                                    placeholder="Add answer option"
                                    class="border p-1 flex-1"
                                    max-width="600"
                                    :rules="rules"
                                />
                            <v-btn color="primary" @click="addOption">add option</v-btn>
                        </div>
                        <v-responsive
                            class="p-4"
                        >
                            <v-text-field
                            hide-details="auto"
                            class="ml-4 mr-4 pb-4"
                            label="Reference"
                            placeholder="john 3:16"
                            type="input"
                            v-model="reference"
                            :rules="rules"
                            ></v-text-field>
                        </v-responsive>
                        <v-responsive
                            class="p-4"
                            v-if="type != 'mc'"
                        >
                            <v-text-field
                            hide-details="auto"
                            class="ml-4 mr-4 pb-4"
                            label="Correct Answer"
                            placeholder="john"
                            type="input"
                            v-model="correctAnswer"
                            :rules="rules"
                            ></v-text-field>
                        </v-responsive>
        
                    </div>
                    <v-btn 
                        color="rgb(154, 63, 63)" 
                        variant="flat"
                        class="ml-4 mb-4"
                        type="submit"
                        :loading="loading"
                        >Save Question</v-btn>
                    </v-form>
                </v-card>
                
                <!--  section to preview questions and submit-->
                  <v-card v-if="openPreview" class="mt-4">
                    <v-card-title class="text-green">Preview Questions</v-card-title>
                    <div v-for="question, index in questions">
                        <div class="border-solid border-2 rounded ml-4 mr-4 mb-4">
                            <h3 class="ml-4">Question {{ index +1 }}: {{ question.question }}</h3>
                        <span class="ml-4 opacity-0.2">reference: {{ question.reference }}</span>
                        <v-list v-if="question.options">
                            <v-list-item
                                v-for="(option, index) in question.options"
                                :key="index"
                                
                            >
                             <div class="d-flex flex-row justify-between">
                                 <strong>{{ alphabetLabel(index) }}.</strong>
                                 <v-list-item-title class="ml-2">
                                    {{ option }}
                                </v-list-item-title>
                             </div>
                            </v-list-item>
                            <p class="ml-4"><strong class="text-green">Correct Answer:</strong> {{ question.correctAnswer}} </p>
                      
                        
                        </v-list>
                        <p v-else class="ml-4"><strong>Correct Answer:</strong> {{ question.correctAnswer }}</p>
                        </div>
                    </div>
                    <v-card-actions>
                        <v-btn color="rgb(154, 63, 63)" variant="flat" class="ml-2" :loading="loading" @click="submitAllQuestions">Set Quiz</v-btn>
                    </v-card-actions>
                  </v-card>
                
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { prod } from '../../api';
import { useToast } from 'vue-toastification';
import axios from "axios"

const question = ref('')
const type = ref('')
const newOption = ref([])
const options = ref([])
const reference = ref('')
const correctAnswer = ref('')
const servingMCQuestions = ref(false)

const selectedOption = ref(null)
const loading = ref(false)

// add these separately to the data object
const quizLevel=ref('')
const levelName=ref('')

//an array to send to the backend
const questions=ref([])

const alphabetLabel = (index) => String.fromCharCode(65 + index)

// Add new option dynamically
const addOption = () => {
  if (!newOption.value.trim()) return
  const id = options.value.length ? options.value[options.value.length - 1].id + 1 : 1
  options.value.push(newOption.value )
  newOption.value = ''
}

// Remove option dynamically
const removeOption = (index) => {
  if (options.value[index].value === selectedOption.value) {
    selectedOption.value = null
  }
  options.value.splice(index, 1)
}

const openPreview = ref(false)

const toast = useToast()
const saveQuestion = ()=>{
    loading.value=true
    if(selectedOption.value === null){
        toast.error('indicate the correct answer from your options')
        loading.value=false
    }else{
        openPreview.value = true;
    if(type.value === 'mc'){
            servingMCQuestions.value = true
            questions.value.push({question:question.value, type:type.value, reference:reference.value, options: [...options.value], correctAnswer:selectedOption.value})
          
        }else{
            questions.value.push({question:question.value, type:type.value, reference:reference.value, correctAnswer:correctAnswer.value})
            servingMCQuestions.value = false


    }
//     const { valid } = formRef.value.validate()
//  if (valid) {
//     console.log('Form valid!')
//     // optionally reset validation
//     formRef.value.resetValidation()
//   }
    resetInputs()
    }
   
}

const formRef=ref(null)

const resetInputs = () => {
  question.value = ''
  type.value = ''
  options.value = []
  newOption.value = ''
  selectedOption.value = ''
  reference.value = ''
  correctAnswer.value = ''
    loading.value=false
  formRef.value?.resetValidation()
}

const submitAllQuestions = async () => {
    loading.value=true
    const data = {
        quizLevel:quizLevel.value,
        levelName:levelName.value,
        questions:questions.value
    }
  try {
    if(servingMCQuestions.value === true){
       const response = await axios.post(`${prod}human_create_mc_questions`,data)
        questions.value = [] // clear after successful submit
        toast.success(response.data.message,{timeout:4000})
        loading.value=false
    }else{
        const response = await axios.post(`${prod}human_create_cloze_questions`, data)
        questions.value = [] // clear after successful submit
        toast.success(response.data.message,{timeout:4000})
        loading.value=false
    }
} catch (error) {
    console.error(error)
    toast.error(error,{timeout:4000})
    loading.value=false
  }
}


const rules = [
    value => {
      if (value) return true
      return 'This field is required.'
    },
  ]
</script>