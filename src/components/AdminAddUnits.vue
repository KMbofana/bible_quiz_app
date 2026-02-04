<template>
  
    <AdminNavigation v-if="role ==='admin'"/>
    <RegistrarNavigation v-else />
      <v-container class="pa-8">
      <v-card class="pa-6">
               <div class=" d-flex justify-center">
                  <h4>Create Church Organization</h4>
               </div>
      <div class="ma-10 ga-10">
        <div class="d-flex justify-center ">
          <div class="d-flex flex-row ga-4 ">
              <v-btn class=""@click="division = true"  color="rgb(154, 63, 63)">
                + Division
              </v-btn>
              <v-btn class="" @click="openModal('Union')" color="rgb(154, 63, 63)">
                + Union
              </v-btn>
              <v-btn class="" @click="openModal('Conference')" color="rgb(154, 63, 63)">
                + Conference
              </v-btn>
              <v-btn class="" @click="openModal('Federation')" color="rgb(154, 63, 63)">
                + Federation
              </v-btn>
              <v-btn class="" @click="openModal('District')" color="rgb(154, 63, 63)">+ District</v-btn>
            <v-btn class="" @click="openModal('Church')" color="rgb(154, 63, 63)">+ Church</v-btn>
          </div>
        </div>

        <!-- division dialog -->
        <div>
          <v-dialog v-model="division" width="auto">
            <v-card
              prepend-icon="mdi-update"
              title="Add Division"
              class="bg-white pa-8"
            >
              <form @submit.prevent="save">
                <div>
                     <v-select
                    label="Select Type"
                    :items="['Division', 'Union','Conference','Federation','District','Church']"
                    item-title="name"
                    item-value="id"
                    v-model="selectedType"
                  ></v-select>
                  <input
                    type="text"
                    class="textInputDialog ml-4"
                    placeholder="division name"
                    v-model="divisionName"
                  />
                </div>
                <div class="btnPosition">
                  <v-btn class="subBtn" type="submit" color="rgb(154, 63, 63)" :loading="loading">
                    Save
                  </v-btn>
                </div>
              </form>

              <template v-slot:actions>
                <v-btn
                  class="ms-auto"
                  text="Cancel"
                  @click="division = false"
                ></v-btn>
              </template>
            </v-card>
          </v-dialog>
        </div>

         <!-- union -->
        <div>
          <v-dialog v-model="union" width="auto">
            <v-card
              prepend-icon="mdi-update"
              title="Add Union"
              class="bg-white pa-8"
            >
              <form @submit.prevent="save">
                  <div>
                    <v-select
                       label="Select Division"
                       :items="divisions" 
                       item-title="name"
                       item-value="id"
                       v-model="selectedParentId"
                     ></v-select>
                     <v-select
                    label="Select Type"
                    :items="['Division', 'Union','Conference','Federation','District','Church']"
                    item-title="name"
                    item-value="id"
                    v-model="selectedType"
                  ></v-select>
                  <input
                    type="text"
                    class="textInputDialog ml-4"
                    placeholder="union name"
                    v-model="unionName"
                  />
                </div>
                <div class="btnPosition">
                  <v-btn class="subBtn" type="submit" color="rgb(154, 63, 63)" :loading="loading">
                    Save
                  </v-btn>
                </div>
              </form>

              <template v-slot:actions>
                <v-btn
                  class="ms-auto"
                  text="Cancel"
                  @click="union = false"
                ></v-btn>
              </template>
            </v-card>
          </v-dialog>
        </div>

         <!-- conference -->
        <div>
          <v-dialog v-model="conference" width="auto">
            <v-card
              prepend-icon="mdi-update"
              title="Add Conference"
              class="bg-white pa-8"
            >
              <form @submit.prevent="save">
                <div>
                     <v-select
                    label="Select Union"
                    :items="unions"
                    item-title="name"
                    item-value="id"
                    v-model="selectedParentId"
                  ></v-select>
                  <v-select
                    label="Select Type"
                    :items="['Division', 'Union','Conference','Federation','District','Church']"
                    item-title="name"
                    item-value="id"
                    v-model="selectedType"
                  ></v-select>
                  <input
                    type="text"
                    class="textInputDialog ml-4"
                    placeholder="conference name"
                    v-model="conferenceName"
                  />
                </div>
                <div class="btnPosition">
                  <v-btn class="subBtn" type="submit" color="rgb(154, 63, 63)" :loading="loading">
                    Save
                  </v-btn>
                </div>
              </form>

              <template v-slot:actions>
                <v-btn
                  class="ms-auto"
                  text="Cancel"
                  @click="conference = false"
                ></v-btn>
              </template>
            </v-card>
          </v-dialog>
        </div>

        <!-- federation -->
        <div>
          <v-dialog v-model="federation" width="auto">
            <v-card
              prepend-icon="mdi-update"
              title="Add Federation"
              class="bg-white pa-8"
            >
              <form @submit.prevent="save">
                <div class="d-flex flex-column ga-4">
                  <v-select
                    label="Select Conference"
                    :items="conferences"
                    item-title="name"
                    item-value="id"
                    v-model="selectedParentId"
                  ></v-select>
                  <v-select
                    label="Select Type"
                    :items="['Division', 'Union','Conference','Federation','District','Church']"
                    item-title="name"
                    item-value="id"
                    v-model="selectedType"
                  ></v-select>
                  <input
                    type="text"
                    class="textInputDialog ml-4"
                    placeholder="federation name"
                    v-model="federationName"
                  />
                </div>
                <div class="btnPosition">
                  <v-btn class="subBtn" type="submit" color="rgb(154, 63, 63)" :loading="loading">
                    Save
                  </v-btn>
                </div>
              </form>

              <template v-slot:actions>
                <v-btn
                  class="ms-auto"
                  text="Cancel"
                  @click="federation = false"
                ></v-btn>
              </template>
            </v-card>
          </v-dialog>
        </div>

        <!-- district -->
        <div>
          <v-dialog v-model="district" width="auto">
            <v-card
              prepend-icon="mdi-update"
              title="Add District"
              class="bg-white pa-8"
            >
              <form @submit.prevent="save">
                <div class="d-flex flex-column ga-4">
                  <v-select
                    label="Select Federation"
                    :items="federations"
                    item-title="name"
                    item-value="id"
                    v-model="selectedParentId"
                  ></v-select>
                  <v-select
                    label="Select Type"
                    :items="['Division', 'Union','Conference','Federation','District','Church']"
                    item-title="name"
                    item-value="id"
                    v-model="selectedType"
                  ></v-select>
                  <input
                    type="text"
                    class="textInputDialog ml-4"
                    placeholder="district name"
                    v-model="districtName"
                  />
                </div>
                <div class="btnPosition">
                  <v-btn class="subBtn" type="submit" color="rgb(154, 63, 63)" :loading="loading">
                    Save
                  </v-btn>
                </div>
              </form>

              <template v-slot:actions>
                <v-btn
                  class="ms-auto"
                  text="Cancel"
                  @click="district = false"
                ></v-btn>
              </template>
            </v-card>
          </v-dialog>
        </div>
 <!-- church dialog 1 -->
        <div>
          <v-dialog v-model="church" width="auto">
            <v-card
              prepend-icon="mdi-update"
              title="Add Church"
              class="bg-white pa-8"
            >
              <form @submit.prevent="save">
                <div class="d-flex flex-column ga-4">
                  <v-select
                    label="Select District"
                    :items="districts"
                    item-title="name"
                    item-value="id"
                    v-model="selectedParentId"
                  ></v-select>
                  <v-select
                    label="Select Type"
                    :items="['Division', 'Union','Conference','Federation','District','Church']"
                    item-title="name"
                    item-value="id"
                    v-model="selectedType"
                  ></v-select>
                  <input
                    type="text"
                    class="textInputDialog ml-4"
                    placeholder="church name"
                    v-model="churchName"
                  />
                </div>
                <div class="btnPosition">
                  <v-btn class="subBtn" type="submit" color="rgb(154, 63, 63)" :loading="loading">
                    Save
                  </v-btn>
                </div>
              </form>

              <template v-slot:actions>
                <v-btn
                  class="ms-auto"
                  text="Cancel"
                  @click="church = false"
                ></v-btn>
              </template>
            </v-card>
          </v-dialog>
        </div>
       
      </div>
      <v-skeleton-loader
        type="table"
        v-if="loadingTableData"
      ></v-skeleton-loader>
      <v-container v-else class="dataTableDesign">
        <v-data-table
          :headers="headersAdminCatalogue"
          :items="churches"
          :sort-by="[
            { key: 'conferenceName', order: 'asc' },
            { key: 'churchName', order: 'asc' },
            { key: 'federationName', order: 'asc' },
          ]"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Catalogue Table</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="600px">
                <v-card class="userMngmntDesign">
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="4" sm="6">
                          <div class="d-flex flex-column">
                            <v-select
                              :items="['active', 'inactive']"
                              item-title="churchName"
                              item-value="id"
                              return-object
                              class=""
                              label="Account Status"
                              single-line
                            ></v-select>
                          </div>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <div class="d-flex flex-column">
                            <v-select
                              :items="positions"
                              item-title="positionName"
                              item-value="id"
                              return-object
                              class=""
                              v-model="position"
                              label="Position"
                              single-line
                            ></v-select>
                          </div>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <div class="d-flex flex-column">
                            <v-select
                              :items="userGroups"
                              item-title="groupName"
                              item-value="id"
                              return-object
                              class=""
                              v-model="userGroup"
                              label="User Group"
                              single-line
                            ></v-select>
                          </div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="close">
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="saveUpDate"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon class="me-2" size="small" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="rgb(154, 63, 63)" @click="initialize"> Reset </v-btn>
          </template>
        </v-data-table>
      </v-container>   
            </v-card>
      </v-container>
  

</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import {prod} from "../../api";
import { useToast } from "vue-toastification";
import { shallowRef } from 'vue';
import {useAuthStore} from "../stores/auth"

const open = shallowRef(true)
const authStore = useAuthStore();
const role = computed(() => authStore.userRole)

const toast = useToast();
const loading = ref(false)


      const dialog = ref(false)
      const dialogDelete= ref(false)
      const searchAdminCatalogue = ref("")
      const headersAdminCatalogue = ref([
        { key: "conferenceName", title: "Conference" },
        { key: "regionName", title: "Region" },
        { key: "federationName", title: "Federation" },
        { key: "districtName", title: "District" },
        { key: "churchName", title: "Church" },
        { title: "Actions", key: "actions", sortable: false },
      ])


      const church = ref(false)
      const district = ref(false)
      const federation = ref(false)
      const division = ref(false)
      const conference = ref(false)
      const union = ref(false)
      
      
      const divisions = ref([])
      const unions = ref([])
      const conferences = ref([])
      const federations = ref([])
      const districts = ref([])
      const churches = ref([])

      const conferenceName = ref("")
      const divisionName = ref("")
      const federationName = ref("")
      const districtName = ref("")
      const churchName = ref("")
      const unionName = ref("")

      const selectedType = ref("")
      const selectedParentId = ref("")

      // *****
      const userGroups = ref([])
      const userGroup = ref({ groupName: "usergroup", id: " " })
      const positions = ref([
        { positionName: "President", id: 0 },
        { positionName: "Vice President", id: 0 },
        { positionName: "Secretary", id: 0 },
        { positionName: "Treasurer", id: 0 },
      ])
      const position = ({ positionName: "position", id: -1 })
      const churchesRetrieved = ref(false)
      const editedIndex= ref(-1)
      const editedItem = ref({
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      })
      const defaultItem = ref({
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      })
      const requesting= ref(false)
      const loadingTableData = ref(false)
      const token =ref('')
      //**** */
 
  const formTitle = computed(()=> {
      return editedIndex.value === -1 ? "Edit User" : "Edit User";
    })
    
  

  watch(dialog, (val) =>{
      if(!val) close();
    } )

    watch( dialogDelete, (val)=> {
      if(val) closeDelete();
    })

//   created() {
//     this.initialize();
//   }


    // *** actionable table
    const users = ref([])
  const  initialize = ()=> {
    users.value.push( 
      {
        name: "Frozen Yogurt",
        church: 159,
        district: 6.0,
        federation: 24,
        conference: 4.0,
      },
    )
    console.log(users.value)

    }

    const  editItem = (item)=> {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    }

    const deleteItem = (item)=> {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    }

    const deleteItemConfirm = () => {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    }

    const close =() =>{
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    }

    const closeDelete = ()=> {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    }

    // save() {

    //   if (this.editedIndex > -1) {
    //     Object.assign(this.desserts[this.editedIndex], this.editedItem);
    //   } else {
    //     this.desserts.push(this.editedItem);
    //   }
    //   this.close();
    // },

    const saveUpDate = () =>{
      this.requesting = true;
      setTimeout(() => {
        this.requesting = false;
      }, 1000);
    }

    // ***
    const names = [
  divisionName.value,
  unionName.value,
  conferenceName.value,
  federationName.value,
  districtName.value,
  churchName.value
]

const resetFormFields = () => {
  try {
        divisionName.value = ""
        unionName.value = ""
        conferenceName.value = ""
        federationName.value = ""
        districtName.value = ""
        churchName.value = ""
        selectedType.value = ""
        selectedParentId.value = ""


        // close open modals
         union.value = false
         conference.value = false
         federation.value = false
         district.value = false
         church.value = false

  } catch (error) {
    console.log(error)
  }
}


    const save = async () => {
      try {
          loading.value = true
       const data = {
            name:divisionName.value ||
                unionName.value ||
                conferenceName.value ||
                federationName.value ||
                districtName.value ||
                churchName.value,
            type:selectedType.value,
            parentId: selectedParentId.value || null
        }

          await axios.post(`${prod}orgunits/add_each_unit`,data)
          loading.value=false
          toast.success('organization unit save successfully!', {timeout:4000})
          resetFormFields();
      } catch (error) {
        resetFormFields();
        console.log(error)
        toast.error(error)
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


   const openModal = (type) => {
            // reset all modals (optional if only one should show at a time)
        division.value = false
        union.value = false
        conference.value = false
        federation.value = false
        district.value = false
        church.value = false

        // set the selected type
        selectedType.value = type

        // open the right modal
        if (type === 'Union') union.value = true
        if (type === 'Conference') conference.value = true
        if (type === 'Federation') federation.value = true
        if (type === 'District') district.value = true
        if (type === 'Church') church.value = true

        // call your function
        getEachUnit()
    }

   const getRegionsByCoference = () => {
      console.log("changed value", this.selectedConference);
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${url}region/regions/${this.selectedConference}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios
        .request(config)
        .then((response) => {
          console.log(response.data.object);
          response.data.object.map((res) => {
            this.regions = [];
            this.regions.push({
              id: res.id,
              name: res.regionName,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    const getFederationByRegion = () => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${url}federation/federations/${this.selectedConference}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios
        .request(config)
        .then((response) => {
          response.data.map((res) => {
            this.federations.push({
              id: res.data.object.id,
              name: res.data.object.regionName,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
   const getDistrictByFederation = () => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${url}district/districts/${this.selectedConference}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios
        .request(config)
        .then((response) => {
          response.data.map((res) => {
            this.districts.push({
              id: res.data.object.id,
              name: res.data.object.regionName,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    const mapData = (data, name) => {
      let requiredArray = [];
      data.map((d) => {
        requiredArray.push({ id: d.id, name: d[name] });
      });
      return requiredArray;
    }

   const  getCatalogueTableData = ()=> {
      this.loadingTableData = true;
      // let token = localStorage.getItem("token");
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${url}church/churches`,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response.data.object);
          this.churchesRetrieved = false;
          response.data.object.map((church) => {
            this.loadingTableData = false;
            this.churches.push({
              id: church.id,
              conferenceName:
                church.district.federation.region.conference.conferenceName,
              regionName: church.district.federation.region.regionName,
              federationName: church.district.federation.federationName,
              districtName: church.district.districtName,
              churchName: church.churchName,
            });
          });

          console.table(this.churches);
        })
        .catch((error) => {
          this.loadingTableData = false;
          this.churchesRetrieved = true;
          console.log(error);
        });
    }
  
//   mounted() {
//     this.getallLevels();
//     this.getCatalogueTableData();
//   }

</script>

<style src="../assets/styles.css"></style>