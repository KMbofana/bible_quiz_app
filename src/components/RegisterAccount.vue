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
                :items="districts"
                item-title="name"
                item-value="id"
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
                v-show="false"
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
                :loading="loading"
            >Register</v-btn>
            <div v-if="error" class="error">{{ error }}</div>
        <!-- </form> -->
    </div>
   </v-container>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useToast } from "vue-toastification";
import { useRouter } from 'vue-router';
import { prod } from '../../api';


const toast = useToast()
const route = useRouter()

const firstname = ref('')
const lastname = ref('')
const phone = ref('')
const district = ref('')
const email = ref('')
const role = ref('user')
const password = ref('')
const error = ref('')
const loading = ref(false)

    const divisions = ref([])
    const unions = ref([])
    const conferences = ref([])
    const federations = ref([])
    const districts = ref([])
    const churches = ref([])

onMounted(()=>{
    getEachUnit()
})

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
      loading.value = false
            });
        } catch (err) {
            error.value = err.message
        }
    }



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

  } catch (err) {
    console.error("Error fetching units:", err)
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