<template>
   <v-container>
     <div class="register-account">
        <h2>Login To Start Quiz</h2>
        <!-- <form @submit.prevent="register"> -->
            <v-responsive
                class=""
                max-width="344"
            >
            <v-text-field
            hide-details="auto"
            label="Email address"
            placeholder="johndoe@gmail.com"
            type="email"
            v-model="email"
            required
            ></v-text-field>
        </v-responsive>
        <!-- <br /> -->
        <v-responsive
            class=""
            max-width="344"
        >
            <v-text-field
                hint="Enter your password to access this website"
                label="Password"
                type="input"
                v-model="password"
                required
                ></v-text-field>
            </v-responsive>
            <v-btn 
                
                color="primary"
                variant="flat"
                @click="login"
                size="large"
                :loading="loading"
            >Login</v-btn>
            <div v-if="error" class="error">{{ error }}</div>
            <a class="link" href="/registration">Register Account</a>
        <!-- </form> -->
    </div>
   </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { jwtDecode } from "jwt-decode";
import { prod, dev } from '../../api';


    const email = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)

    const toast = useToast();
    const route = useRouter()

    const login = async () => {
        error.value = ''
        loading.value = true
       console.log(loading.value)
        const data = {
            email:email.value,
            password:password.value
        }

        try {
          axios.post(`${prod}login`,data )
          .then((result) => {
            console.log(result)
            toast.success(result.data.message, {
                timeout:5000
            })
            const decoded = jwtDecode(result.data.token)
                console.log(decoded.role)
                if(decoded.role ==="user"){
                  
                    route.push('/student_portal')
                }else{
                  
                    route.push('/create_mc_questions')
                }
            
          }).catch((err) => {
            console.log(error)
            toast.error(err.response.data.message, {
                timeout:3000
            })
          });
        } catch (err) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    
    
</script>

<style scoped>
.register-account {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.error {
    color: red;
    margin-top: 1rem;
}
.link{
    text-decoration: none;
}
</style>