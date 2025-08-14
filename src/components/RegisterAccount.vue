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
                :disabled="loading"
                color="primary"
                variant="flat"
                @click="register"
                size="large"
            >Register</v-btn>
            <div v-if="error" class="error">{{ error }}</div>
        <!-- </form> -->
    </div>
   </v-container>
</template>

<script>
import { ref } from 'vue'

// Import Firebase SDK (make sure you have initialized Firebase elsewhere)
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

export default {
    name: 'RegisterAccount',
    setup() {
        const email = ref('')
        const password = ref('')
        const error = ref('')
        const loading = ref(false)

        const register = async () => {
            error.value = ''
            loading.value = true
            try {
                const auth = getAuth()
                await createUserWithEmailAndPassword(auth, email.value, password.value)
                // Registration successful, redirect or show success message
            } catch (err) {
                error.value = err.message
            } finally {
                loading.value = false
            }
        }

        return { email, password, error, loading, register }
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