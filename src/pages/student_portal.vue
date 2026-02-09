
<template>
    <StudentNavigation />
   <v-container>
           
                <v-card>
                    <v-card-title class="text-h5">Quiz Programs</v-card-title>
                    <v-card-text>
                        <p>Select the level below</p>
                        <i class="text-red">Please Note: Quiz levels are activate as you successfully enroll or qualify</i>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="handleQuizLevel('District')">District</v-btn>
                        <v-btn color="secondary" @click="handleQuizLevel('Federation')" >Fedration</v-btn>
                        <v-btn color="success" @click="handleQuizLevel('Conference')" disabled>Conference</v-btn>
                        <v-btn color="success" @click="handleQuizLevel('ZEUC')" disabled>ZEUC</v-btn>
                        <v-btn color="success" @click="handleQuizLevel('SADC')" disabled>SADC</v-btn>
                        <v-btn color="success" @click="handleQuizLevel('GC')" disabled>General Conference</v-btn>
                    </v-card-actions>
                </v-card>
                <v-row class="mt-5">
                    <v-col cols="6">
                        <v-card v-if="quizStore.currentLevel">
                            <v-card-title>District - {{ `${authStore.userDistrict}` }}</v-card-title>
                            <v-card-subtitle class="text-red" v-if="quizStore.currentLevel">Attempting {{ quizStore.currentLevel }} Questions</v-card-subtitle>
                            <br/>
                            <v-divider></v-divider>
                            <v-card-subtitle>Select Quistionier Type</v-card-subtitle>
                            <v-card-actions>
                                <div class="d-flex flex-row">
                                    <v-btn color="#fff" class="btnDesign" to="/human_mc_questions">Multiple Choice</v-btn>
                                    <v-btn color="rgb(154, 63, 63)" to="/cloze_questions">Cloze Question</v-btn>
                                </div>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                    <v-col cols="6"></v-col>
                </v-row>
            

    </v-container>
</template>

<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "roles": ["user"]
  }
}
</route>

<script setup>
import {ref, onMounted} from 'vue'
import {useQuizStore} from "../stores/quizLevel"
import {useAuthStore} from "../stores/auth"

const quizStore = useQuizStore()
const authStore = useAuthStore()



    const handleQuizLevel = (level)=>{
      
        quizStore.setQuizLevel(level)
        // quizStore.setLevelName(authStore.userDistrict)
    }

</script>

<style>

.btnDesign{
    background-color: rgb(154, 63, 63);
}

</style>