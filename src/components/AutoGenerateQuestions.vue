<template>
    <AdminNavigation />
    <v-container>
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
                    <v-textarea v-model="bookNames" >

                    </v-textarea>
                </v-responsive>
                <v-responsive >
                    <v-btn variant="flat" type="submit" :loading="isGenerating" color="rgb(154, 63, 63)" block="">Generate</v-btn>
                </v-responsive>
            </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import {ref} from "vue"
import axios from "axios"
import { prod } from '../../api';
import { useToast } from 'vue-toastification';

const toast = useToast()

const quizLevel = ref('')
const bookNames = ref('')
const levelName = ref('')
const type = ref('')
const numberOfQuestions = ref(0)

const isGenerating = ref(false)


//populating level arrays
 const divisions = ref([])
 const unions = ref([])
 const conferences = ref([])
 const federations = ref([])
 const districts = ref([])
 const churches = ref([])

const levelNames = ref([])

const generateQuestions = async () =>{
    isGenerating.value= true
    const data = {
        level:quizLevel.value,
        levelName:levelName.value,
        bookName:bookNames.value,
        numberOfQuestions:numberOfQuestions.value
    }
    if(type.value === "mc"){
        console.log("inside mc")
        await axios.post(`${prod}questions/admin_generate_ai_mc_questions`,data)
        .then((result) => {
            toast.success('questions generated succefully', 4000)
            isGenerating.value= false
        }).catch((err) => {
            console.log(err)
            toast.error('error generating questions', 4000)
            isGenerating.value= false
        });
    }else{
        console.log("inside cloze")
        await axios.post(`${prod}questions/admin_generate_ai_cloze_questions`,data)
        .then((result) => {
            toast.success('questions generated succefully', 4000)
            isGenerating.value= false
        }).catch((err) => {
            console.log(err)
            toast.error('error generating questions', 4000)
            isGenerating.value= false
        });
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