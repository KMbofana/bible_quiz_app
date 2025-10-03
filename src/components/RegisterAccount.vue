<template>
   <v-container>
     <div class="register-account">
        <h2>Register Bible Quiz Account</h2>
        <!-- <form @submit.prevent="register"> -->
            <v-responsive
                class=""
                max-width="344"
            >
            <v-text-field
            hide-details="auto"
            label="First Name"
            placeholder="john"
            type="input"
            v-model="firstname"
            required
            ></v-text-field>
        </v-responsive>
            <v-responsive
                class=""
                max-width="344"
            >
            <v-text-field
            hide-details="auto"
            label="Last Name"
            placeholder="Doe"
            type="input"
            v-model="lastname"
            required
            ></v-text-field>
        </v-responsive>
            <v-responsive
                class=""
                max-width="344"
            >
            <v-text-field
            hide-details="auto"
            label="phone"
            placeholder="0775467378"
            type="number"
            v-model="phone"
            required
            ></v-text-field>
        </v-responsive>
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
            <v-responsive
                class=""
                max-width="344"
            >
            <v-select
                label="District"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                v-model="district"
                required
                ></v-select>
           
        </v-responsive>
            <v-responsive
                class=""
                max-width="344"
            >
            <v-select
                label="Role"
                :items="['user', 'admin']"
                v-model="role"
                required
                ></v-select>
        </v-responsive>
           
        <!-- <br /> -->
        <v-responsive
            class=""
            max-width="344"
        >
            <v-text-field
                hint="Enter your password to access this website"
                label="Password"
                type="password"
                v-model="password"
                required
                ></v-text-field>
            </v-responsive>
            <v-btn 
                :disabled="loading"
                color="rgb(154, 63, 63)"
                variant="flat"
                @click="register"
                size="large"
            >Register</v-btn>
            <div v-if="error" class="error">{{ error }}</div>
        <!-- </form> -->
    </div>
   </v-container>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useToast } from "vue-toastification";
import { useRouter } from 'vue-router';
import { prod, dev } from '../../api';

const toast = useToast()
const route = useRouter()

const firstname = ref('')
const lastname = ref('')
const phone = ref('')
const district = ref('')
const email = ref('')
const role = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

    const register = async () => {
        error.value = ''
        loading.value = true
        const data = {
            firstname:firstname.value,
            lastname:lastname.value,
            phone:phone.value,
            district:district.value,
            email:email.value,
            role:role.value,
            password:password.value
        }
        try {

            axios.post(`${prod}user_registration`, data)
            .then((result) => {
                console.log(result)
                toast.success(result.data.message, {
        timeout: 2000
      })
      route.push('/')
            }).catch((err) => {
                console.log(err)
                toast.error(err.response.data.message, {
        timeout: 2000
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
</style>