
<template>
   <v-container>
        <v-row>
            <v-col cols="2">
                <StudentNavigation />
                
            </v-col>
            <v-col cols="12">
                <v-card>
                    <v-card-title class="text-h5">Quiz Programs</v-card-title>
                    <v-card-text>
                        <p>Quiz levels are activate as you successfully enroll or qualify</p>
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
                        <v-card>
                            <v-card-title>District - {{ `${quizStore.currentLevel}` }}</v-card-title>
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
            </v-col>
        </v-row>

    </v-container>
</template>

<script setup>
import {useQuizStore} from "../stores/quizLevel"
import axios from "axios"
import { prod } from '../../api';

const quizStore = useQuizStore()
    const handleQuizLevel = (level)=>{
        const levelName = "Zuda";
        console.log(level)
        quizStore.setQuizLevel(level)
        quizStore.setLevelName(levelName)
        axios.get(`${prod}questions/student_view_mc_questions`,
            {
                 params: {
                    quizLevel:level,
                    levelName
                }
            }
        )
        .then((result) => {
            console.log(result.data)
            
        }).catch((err) => {
         console.error(err)   
        });
    }

</script>

<style>

.btnDesign{
    background-color: rgb(154, 63, 63);
}

</style>