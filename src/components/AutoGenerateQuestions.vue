<template>
    <AdminNavigation />
    <v-container class="position-relative">
        <v-row>
            <v-col cols="12">
                <v-form @submit.prevent="generateQuestions">
                <v-responsive class="">
                    <v-select
                        label="Quiz Level"
                        :items="['District', 'Federation', 'Conference', 'Union', 'Division', 'GC']"
                        v-model="quizLevel"
                        class="ml-4 mr-4 pb-4"
                        required
                        ></v-select>
            
                </v-responsive>
                <v-responsive class="">
                    <v-select
                        label="Level Name"
                        :items="levelNames"
                        item-title="name"
                        item-value="name"
                        v-model="levelName"
                        class="ml-4 mr-4 pb-4"
                        required
                        ></v-select>
            
                </v-responsive>
                 <v-responsive class="">
                    <v-select
                        label="Quiz Type"
                        :items="['mc', 'cloze',]"
                        v-model="type"
                        class="ml-4 mr-4 pb-4"
                        required
                        ></v-select>
            
                </v-responsive>
                 <v-responsive class="">
                    <v-select
                        label="Number of Questions"
                        :items="[15, 20, 25]"
                        v-model="numberOfQuestions"
                        class="ml-4 mr-4 pb-4"
                        required
                        ></v-select>
            
                </v-responsive>
                <v-responsive>
                    <v-autocomplete :items="[
                      'Great Controvesy', 
                      'Messages To Young People', 
                      'Daniel and Revelations', 
                      'Desire of Ages', 
                      'Steps to Christ', 
                      'Patriachs and Prophets',
                      'Prophets and Kings',
                      'Bible'
                      ]"
                      label="Book Name"
                      class="ml-4 mr-4 pb-4"
                      v-model="bookNames"
                      >

                    </v-autocomplete>
                </v-responsive>
                <v-responsive>
                    <v-textarea class="ml-4 mr-4 pb-4" v-model="instruction" label="instruction">

                    </v-textarea>
                </v-responsive>
                <v-responsive >
                    <v-btn variant="flat" type="submit" :loading="isGenerating" color="rgb(154, 63, 63)" block="">Generate</v-btn>
                </v-responsive>
            </v-form>
            </v-col>
        </v-row>
       <v-dialog :model-value="dialog">
          <v-card>
            <v-card-title class="text-center">Preview Questions</v-card-title>
            <v-card-text>
              <div v-for="question, indexMain in DataQuestions">
                        <div class="border-solid border-2 rounded ml-4 mr-4 mb-4">
                            <div class="d-flex ga-2">
                              <v-text-field class="ml-4" v-if="Number(editIndexValue) === indexMain" v-model="editedQuestionValue" :placeholder="question.question" hide-details variant="plain" density="compact" @update:model-value="val => {editedQuestionValue = val} "></v-text-field> <h3 v-else class="ml-4 mt-1">Question {{ indexMain +1 }}: {{ question.question }}</h3> 
                            </div>
                        <div class="d-flex ga-2">
                          <v-text-field class="ml-4" v-if="Number(editIndexValue) === indexMain" :placeholder="question.reference " v-model="editedReferenceValue" :details="false" variant="plain" density="compact" >
                            reference: 
                          </v-text-field>
                          <p v-else class="ml-4 opacity-0.2 mt-2">reference: {{question.reference}}</p>
                        </div>
                        <v-list v-if="question.options">
                            <v-list-item
                                v-for="(option, index) in question.options"
                                :key="index"
                                
                            >
                             <div class="d-flex ga-2">
                                 <strong :class="editIndexValue === indexMain ? '' : 'mt-2'">{{ alphabetLabel(index) }}.</strong>
                                    <v-text-field v-if="Number(editIndexValue) === indexMain" :key="index" max-width="300px" v-model="editedOptionValues[`${indexMain}-${index}`]" @update:model-value="val =>  editedOptionIndex = index"  variant="plain" density="compact" :placeholder="option"></v-text-field>
                                  <p v-else>{{ option }}</p>
                                  </div>
                            </v-list-item>
                            <!-- <p class="ml-4"><strong class="text-green">Correct Answer:</strong> {{ question.correctAnswer}} </p> -->
                            <div class="d-flex ma-2 justify-space-between">
                              <v-select
                                v-if="Number(editIndexValue) === indexMain"
                                v-model="editedCorrectAnswer"
                                label="Correct Answer"
                                :items="question.options.map((opt, idx) => ({ title: opt, value: idx }))"
                                item-title="title"
                                item-value="value"
                              >
                                
                              </v-select>
                              <p class="ml-4" v-else><strong class="text-green">Correct Answer:</strong> {{ question.options[Number(question.correctAnswer)]}} </p>
                              <button v-if="editIndexValue === -1" @click="editQuestion(indexMain)" class="ml-2 text-brown">
                               edit question 📝
                                </button>
                              <button v-if="Number(editIndexValue) === indexMain" @click="saveEditQuestion(indexMain)" class="ml-2 text-brown">
                               save ✅
                                </button>
                            </div>
                        
                        </v-list>
                        <div v-else class="d-flex ma-2 justify-space-between">
                          <v-text-field class="ml-4" v-if="Number(editIndexValue) === indexMain" :placeholder="question.correctAnswer " v-model="editedClozeQuestonCorrectAnswerValue" :details="false" variant="plain" density="compact" >
                            Correct Answer: 
                          </v-text-field>
                          <p v-else class="ml-4"><strong>Correct Answer:</strong> {{ question.correctAnswer }}</p>
                          <button v-if="editIndexValue === -1" @click="editQuestion(indexMain)" class="ml-2 text-brown">
                            edit question 📝
                          </button>
                          <button v-if="Number(editIndexValue) === indexMain" @click="saveEditQuestion(indexMain)" class="ml-2 text-brown">
                            save ✅
                          </button>
                        </div>

                        </div>
                    </div>
            </v-card-text>
            <v-card-actions>
              <v-row>
                <v-col>
                  <v-btn color="rgb(154, 63, 63)" variant="flat" @click="regenerateQustions" :loading="regeneratingQuestions" block>Regenerate</v-btn>
                </v-col>
                <v-col>
                  <v-btn color="error" variant="flat" @click="closeDialog" block>Close</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
       </v-dialog>
    </v-container>
</template>

<script setup>
import {ref} from "vue"
import axios from "axios"
import { prod } from '../../api';
// import { useToast } from 'vue-toastification';
import { useQuizStore } from '../stores/quizLevel'
import {useAuthStore} from "../stores/auth"
import { useQuestionsStore } from '../stores/questions'

const quizStore = useQuizStore()
const DataQuestions = ref([])


const authStore = useAuthStore()
const questionStore = useQuestionsStore()

// const toast = useToast()

const quizLevel = ref('')
const bookNames = ref('')
const levelName = ref('')
const instruction = ref('')
const type = ref('')
const numberOfQuestions = ref(0)

const isGenerating = ref(false)
const dialog = ref(false)

//populating level arrays
 const divisions = ref([])
 const unions = ref([])
 const conferences = ref([])
 const federations = ref([])
 const districts = ref([])
 const churches = ref([])

const levelNames = ref([])

const savingQuestions = ref(false)
const regeneratingQuestions = ref(false)
const regenerate = ref(false);

const closeDialog = ()=>{
  try {
    dialog.value = false;
  } catch (error) {
    consoleError.log(error)
  }
}
const regenerateQustions = ()=>{
  regeneratingQuestions.value = true;
  try {
    regeneratingQuestions.value = false;
    dialog.value = false;
    regenerate.value = true
    generateQuestions()
  } catch (error) {
    consoleError.log(error)
  }
}

const alphabetLabel = (index) => String.fromCharCode(65 + index)
const generateQuestions = async () =>{

      const { useToast } = await import('vue-toastification')
      await import('vue-toastification/dist/index.css')

      const toast = useToast()

    isGenerating.value= true
    const data = {
        level:quizLevel.value,
        levelName:levelName.value,
        bookName:bookNames.value,
        numberOfQuestions:numberOfQuestions.value,
        instruction:instruction.value,
        regenerate:regenerate.value
    }
    if(type.value === "mc"){
       try {
           console.log("inside mc")
        const result = await axios.post(`${prod}questions/admin_generate_ai_mc_questions`,data);
            toast.success('questions generated succefully', 4000)
            console.log(result.data.questionSet)
            DataQuestions.value = result.data.questions
            isGenerating.value= false
            dialog.value= true
        
       } catch (error) {
        isGenerating.value= false
        dialog.value= false
        if(error.status === 403) toast.error(error.response.data.message);
        toast.error('error generating questions')
       }
    }else{
        try {
          console.log("inside cloze")
          const result = await axios.post(`${prod}questions/admin_generate_ai_cloze_questions`,data)
          toast.success('questions generated succefully', 4000)
            isGenerating.value= false
            dialog.value= true
             DataQuestions.value = result.data.questions
        } catch (error) {
           console.log(error)
            if(error.status === 403) toast.error(error.response.data.message);
            toast.error('error generating questions', 4000)
            isGenerating.value= false
            dialog.value= false
        }
    }
}

onMounted(()=>{
    getEachUnit()
})

 const getEachUnit = async () => {
  try {
    const { data } = await axios.get(`${prod}orgunits/get_each_unit`)
    console.log("Fetched Data:", data)

    // ✅ Reset all arrays
    divisions.value = []
    unions.value = []
    conferences.value = []
    federations.value = []
    districts.value = []
    churches.value = []

    // ✅ Recursive function
    const traverseUnits = (nodes, level = "Division") => {
      if (!Array.isArray(nodes)) return

      nodes.forEach(node => {
        if (!node?._id || !node?.name) return

        // Push into appropriate array
        switch (level) {
          case "Division":
            divisions.value.push({ id: node._id, name: node.name })
            break
          case "Union":
            unions.value.push({ id: node._id, name: node.name })
            break
          case "Conference":
            conferences.value.push({ id: node._id, name: node.name })
            break
          case "Federation":
            federations.value.push({ id: node._id, name: node.name })
            break
          case "District":
            districts.value.push({ id: node._id, name: node.name })
            break
          case "Church":
            churches.value.push({ id: node._id, name: node.name })
            break
        }

        // Determine next level name
        const nextLevel = {
          Division: "Union",
          Union: "Conference",
          Conference: "Federation",
          Federation: "District",
          District: "Church",
        }[level]

        // Recursively go deeper
        if (node.children && nextLevel) {
          traverseUnits(node.children, nextLevel)
        }
      })
    }

    // ✅ Start traversal from root data
    traverseUnits(data, "Division")
 
    // Debugging output
    console.log("Divisions:", divisions.value)
    console.log("Unions:", unions.value)
    console.log("Conferences:", conferences.value)
    console.log("Federations:", federations.value)
    console.log("Districts:", districts.value)
    console.log("Churches:", churches.value)
    console.log(levelNames.value)

  } catch (err) {
    console.error("Error fetching units:", err)
  }
}


watch(
   quizLevel,(value) =>{
  if(value === 'District'){
    levelNames.value=[]
    districts.value.map((district)=>levelNames.value.push({id:district.id, name:district.name})) 
  }else if(value === 'Federation'){
    levelNames.value=[]
    federations.value.map((federation)=>levelNames.value.push({id:federation.id, name:federation.name})) 
    
  }else if(value === 'Conference'){
    levelNames.value=[]
    conferences.value.map((conference)=>levelNames.value.push({id:conference.id, name:conference.name})) 
    
  }else if(value === 'Union'){
    levelNames.value=[]
    unions.value.map((union)=>levelNames.value.push({id:union.id, name:union.name})) 
    
  }else{
    levelNames.value=[]
    divisions.value.map((division)=>levelNames.value.push({id:division.id, name:division.name})) 
  }
   } 
)

</script>