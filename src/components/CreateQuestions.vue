<template>
    <AdminNavigation />
    <v-container>
                <!--  section to create mc questions-->
                <v-card>
                    <v-card-title>Create Quiz Questions</v-card-title>
                    <v-form @submit.prevent="saveQuestion" ref="formRef">
                        <div class="">
                             <v-responsive
                class=""
            >
            <v-select
                label="Quiz Level"
                :items="['District', 'Federation', 'Conference', 'Union', 'Division', 'GC']"
                v-model="quizLevel"
                class="ml-4 mr-4 pb-4"
                required
                ></v-select>
           
        </v-responsive>
         <v-responsive
                class=""
            >
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
                                    :value="index"
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
                        :loading="isSaveQuestions"
                        >Save Question</v-btn>
                    </v-form>
                </v-card>
                
                <!--  section to preview questions and submit-->
                  <v-card v-if="openPreview" class="mt-4">
                    <v-card-title class="text-green">Preview Questions</v-card-title>
                    <div v-for="question, indexMain in questions">
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
                    <v-card-actions>
                        <v-btn color="rgb(154, 63, 63)" variant="flat" class="ml-2" :loading="loading" @click="submitAllQuestions">Set Quiz</v-btn>
                    </v-card-actions>
                  </v-card>
                
          
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { prod } from '../../api';
// import { useToast } from 'vue-toastification';
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
const isSaveQuestions = ref(false)

// add these separately to the data object
const quizLevel=ref('')
const levelName=ref('')

//an array to send to the backend
const questions=ref([])

//populating level arrays
 const divisions = ref([])
 const unions = ref([])
 const conferences = ref([])
 const federations = ref([])
 const districts = ref([])
 const churches = ref([])
 
 const levelNames= ref([])

//  editing variable names
const editedQuestionValue = ref('')
const editedReferenceValue = ref('')
const editedCorrectAnswer = ref('')
const editedClozeQuestonCorrectAnswerValue = ref('')
const editedOptionValues = ref({})
const editedOptionIndex = ref(-1)

const editIndexValue = ref(-1)

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

const editQuestion = (index) =>{
  editIndexValue.value=index;
  console.log(questions.value)
}
const saveEditQuestion = (questionIndex) => {
  const question = questions.value[questionIndex]

  // Save question text if edited
  if (editedQuestionValue.value) {
    question.question = editedQuestionValue.value
  }

  // Save reference if edited
  if (editedReferenceValue.value) {
    question.reference = editedReferenceValue.value
  }

  // Save reference if edited
if (question.type === 'mc') {
  if (editedCorrectAnswer.value !== null && editedCorrectAnswer.value !== undefined) {
    question.correctAnswer = editedCorrectAnswer.value
  }
} else {
  if (editedClozeQuestonCorrectAnswerValue.value) {
    question.correctAnswer = editedClozeQuestonCorrectAnswerValue.value
  }
}

  // Save edited options
  for (let i = 0; i < question.options.length; i++) {
    const key = `${questionIndex}-${i}`
    if (editedOptionValues.value[key] !== undefined && editedOptionValues.value[key] !== '') {
      question.options[i] = editedOptionValues.value[key]
    }
  }

  // Reset edit state
  editIndexValue.value = -1
  editedQuestionValue.value = ''
  editedReferenceValue.value = ''

  console.log(questions.value)
}



const openPreview = ref(false)

// const toast = useToast()
const saveQuestion = async ()=>{

  const { useToast } = await import('vue-toastification')
await import('vue-toastification/dist/index.css')

const toast = useToast()

    isSaveQuestions.value=true
    
      if(type.value === 'mc'){
        console.log(selectedOption.value === null, options.value.length <= 0, options.value.length)
        if(options.value.length <= 0) {
          toast.error('please add optional answers to your multiple choice question')
          isSaveQuestions.value=false
          return
        }
        if(selectedOption.value === null){
          toast.error('please indicate correct answer from the options')
          isSaveQuestions.value=false
          return
        }
      openPreview.value = true;
      servingMCQuestions.value = true
      questions.value.push({question:question.value, type:type.value, reference:reference.value, options: [...options.value], correctAnswer:selectedOption.value})
      selectedOption.value=null
        }else{
          openPreview.value = true;
          questions.value.push({question:question.value, type:type.value, reference:reference.value, correctAnswer:correctAnswer.value})
          servingMCQuestions.value = false
    }
    resetInputs()
    
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
    isSaveQuestions.value=false
  formRef.value?.resetValidation()
}

const submitAllQuestions = async () => {
  const { useToast } = await import('vue-toastification')
await import('vue-toastification/dist/index.css')

const toast = useToast()
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
        response.data.status == 403 ? toast.error(response.data.message,{timeout:4000}):toast.success(response.data.message,{timeout:4000})
        loading.value=false
    }else{
        const response = await axios.post(`${prod}human_create_cloze_questions`, data)
        questions.value = [] // clear after successful submit
        toast.success(response.data.message,{timeout:4000})
        loading.value=false
    }
} catch (error) {
    console.error(error)
    if(error.status === 409){
      toast.error(error.response.data.message)
      loading.value=false
      return
    }
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
<style scoped>
.v-field__input::placeholder{
  font-size: 180x !important;
  font-weight: 300 !important; 
  color: rgba(0, 0, 0, 0.6);
}
</style>